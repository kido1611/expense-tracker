import type { H3Event } from "h3";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { transactionSchema } from "~/utils/zodSchema";
import { ensureUserIsAvailable } from "~~/server/utils/session";

export default defineEventHandler(async (event: H3Event) => {
  const validatedBody = await readValidatedBody(event, transactionSchema.parse);
  const session = await requireUserSession(event);

  const user = await ensureUserIsAvailable(event, session);

  const wallet = await useDrizzle().query.wallets.findFirst({
    where: and(
      eq(tables.wallets.nanoid, validatedBody.walletNanoid),
      eq(tables.wallets.userId, user.id),
    ),
  });

  if (!wallet) {
    throw createError({
      statusCode: 400,
      message: "Wallet not found",
    });
  }

  const category = await useDrizzle().query.categories.findFirst({
    where: and(
      eq(tables.categories.id, validatedBody.categoryId),
      eq(tables.categories.userId, user.id),
    ),
  });

  if (!category) {
    throw createError({
      statusCode: 400,
      message: "Category not found",
      data: {
        issues: [
          {
            code: "invalid_value",
            path: ["categoryId"],
            message: "Category not found",
          },
        ],
      },
    });
  }

  const [result] = await useDrizzle()
    .insert(tables.transactions)
    .values({
      userId: user.id,
      walletId: wallet.id,
      categoryId: category.id,
      nanoid: nanoid(),
      amount: validatedBody.amount,
      realAmount: category.isExpense
        ? validatedBody.amount * -1
        : validatedBody.amount,
      isVisibleInReport: validatedBody.isVisibleInReport,
      spendAt: validatedBody.spendAt,
      note: validatedBody.note,
    })
    .returning({
      nanoid: tables.transactions.nanoid,
      amount: tables.transactions.amount,
      note: tables.transactions.note,
      spend_at: tables.transactions.spendAt,
      is_visible_in_report: tables.transactions.isVisibleInReport,
      created_at: tables.transactions.createdAt,
    });

  await useDrizzle()
    .update(tables.wallets)
    .set({
      balance:
        wallet.balance -
        (category.isExpense ? validatedBody.amount : validatedBody.amount * -1),
    })
    .where(eq(tables.wallets.id, wallet.id));

  return {
    ...result,
    wallet: {
      nanoid: wallet.nanoid,
      balance:
        wallet.balance -
        (category.isExpense ? validatedBody.amount : validatedBody.amount * -1),
      name: wallet.name,
      created_at: wallet.createdAt,
    },
    category: {
      name: category.name,
      is_expense: category.isExpense,
    },
  };
});

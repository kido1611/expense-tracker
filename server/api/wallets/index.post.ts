import type { H3Event } from "h3";
import { nanoid } from "nanoid";
import { walletSchema } from "~/utils/zodSchema";
import { eq, and } from "drizzle-orm";
import { format } from "date-fns";

export default defineEventHandler(async (event: H3Event) => {
  const validatedBody = await readValidatedBody(event, walletSchema.parse);

  const session = await getUserSession(event);

  const userId = session.user?.id;
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Unauthorized",
    });
  }

  const [wallet] = await useDrizzle()
    .insert(tables.wallets)
    .values({
      userId: userId,
      nanoid: nanoid(),
      name: validatedBody.name,
      balance: validatedBody.balance,
      icon: validatedBody.icon,
    })
    .returning();

  // If balance != 0, add transaction
  if (validatedBody.balance > 0) {
    const category = await useDrizzle().query.categories.findFirst({
      where: and(
        eq(tables.categories.userId, userId),
        eq(tables.categories.key, "income_balance"),
      ),
    });

    if (category) {
      await useDrizzle()
        .insert(tables.transactions)
        .values({
          userId: userId,
          walletId: wallet.id,
          categoryId: category.id,
          nanoid: nanoid(),
          amount: validatedBody.balance,
          realAmount: validatedBody.balance,
          isVisibleInReport: true,
          spendAt: format(new Date(), "yyyy-MM-dd"),
        });
    }
  }

  return {
    nanoid: wallet.nanoid,
    name: wallet.name,
    balance: wallet.balance,
    created_at: wallet.createdAt,
  };
});

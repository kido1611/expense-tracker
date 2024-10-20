import type { H3Event } from "h3";
import { desc, eq } from "drizzle-orm";
import { paginationSchema } from "~/utils/zodSchema";

export default defineEventHandler(async (event: H3Event) => {
  const query = await getValidatedQuery(event, paginationSchema.parse);

  const session = await requireUserSession(event);

  const transactions = await useDrizzle()
    .select({
      nanoid: tables.transactions.nanoid,
      amount: tables.transactions.amount,
      note: tables.transactions.note,
      image_path: tables.transactions.imagePath,
      // tables.transactions.imagePath,
      spend_at: tables.transactions.spendAt,
      is_visible_in_report: tables.transactions.isVisibleInReport,
      created_at: tables.transactions.createdAt,
      wallet: {
        nanoid: tables.wallets.nanoid,
        name: tables.wallets.name,
        balance: tables.wallets.balance,
        created_at: tables.wallets.createdAt,
      },
      category: {
        name: tables.categories.name,
        is_expense: tables.categories.isExpense,
      },
    })
    .from(tables.transactions)
    .innerJoin(
      tables.categories,
      eq(tables.transactions.categoryId, tables.categories.id),
    )
    .innerJoin(
      tables.wallets,
      eq(tables.transactions.walletId, tables.wallets.id),
    )
    .where(eq(tables.transactions.userId, session.user.id))
    .orderBy(
      desc(tables.transactions.spendAt),
      desc(tables.transactions.createdAt),
    )
    .limit(query.limit)
    .offset(query.limit * (query.page - 1));

  return transactions;
});

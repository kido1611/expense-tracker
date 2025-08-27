import { startOfMonth, endOfMonth } from "date-fns";
import { desc, eq, gte, lte } from "drizzle-orm";

export default defineEventHandler(
  async (event): Promise<ApiResponse<CategoryStatTransaction[]>> => {
    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    const startMonth = startOfMonth(new Date());
    const endMonth = endOfMonth(new Date());

    const res = await db
      .select({
        id: tables.categories.id,
        name: tables.categories.name,
        icon: tables.categories.icon,
        is_expense: tables.categories.isExpense,
        transactions_count: sql<number>`count(*)`,
        transactions_sum_amount: sql<number>`sum(${tables.transactions.amount}) as transactions_sum_amount`,
      })
      .from(tables.categories)
      .innerJoin(
        tables.transactions,
        and(
          eq(tables.transactions.categoryId, tables.categories.id),
          eq(tables.transactions.isVisibleInReport, true),

          gte(tables.transactions.transactionAt, startMonth),
          lte(tables.transactions.transactionAt, endMonth),
        ),
      )
      .where(
        and(
          eq(tables.categories.userId, user.id),
          eq(tables.categories.isExpense, true),
        ),
      )
      .orderBy(desc(sql`transactions_sum_amount`))
      .groupBy(tables.categories.id);

    return {
      error: false,
      ...httpStatusMessage[200],
      data: res,
    };
  },
);

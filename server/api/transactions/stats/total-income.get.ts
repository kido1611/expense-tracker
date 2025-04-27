import { startOfMonth, endOfMonth } from "date-fns";

export default defineEventHandler(
  async (event): Promise<ApiResponse<number>> => {
    const session = await requireUserSession(event);
    const user = await ensureUserIsAvailable(event, session);

    const startMonth = startOfMonth(new Date());
    const endMonth = endOfMonth(new Date());

    const db = useDrizzle();

    const totalIncomes = await db
      .select({
        total: sql<number>`cast(sum(${tables.transactions.amount}) as int)`,
      })
      .from(tables.transactions)
      .innerJoin(
        tables.categories,
        eq(tables.transactions.categoryId, tables.categories.id),
      )
      .where(
        and(
          eq(tables.transactions.userId, user.id),
          eq(tables.categories.isExpense, false),
          eq(tables.transactions.isVisibleInReport, true),
          gte(tables.transactions.transactionAt, startMonth),
          lt(tables.transactions.transactionAt, endMonth),
        ),
      );

    return {
      error: false,
      ...httpStatusMessage[200],
      data: totalIncomes[0].total ?? 0,
    };
  },
);

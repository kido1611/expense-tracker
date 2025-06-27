export default defineEventHandler(
  async (event): Promise<ApiResponse<CategoryStatTransaction[]>> => {
    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

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
        ),
      )
      .where(
        and(
          eq(tables.categories.userId, user.id),
          eq(tables.categories.isExpense, true),
        ),
      )
      .orderBy(asc(sql`transactions_sum_amount`))
      .groupBy(tables.categories.id);

    return {
      error: false,
      ...httpStatusMessage[200],
      data: res,
    };
  },
);

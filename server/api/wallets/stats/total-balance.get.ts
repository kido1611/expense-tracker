export default defineEventHandler(
  async (event): Promise<ApiResponse<number>> => {
    const session = await requireUserSession(event);
    const user = await ensureUserIsAvailable(event, session);

    const db = useDrizzle();

    const balance = await db
      .select({
        total: sql<number>`cast(sum(${tables.wallets.balance}) as int)`,
      })
      .from(tables.wallets)
      .where(eq(tables.wallets.userId, user.id));

    return {
      error: false,
      ...httpStatusMessage[200],
      data: balance[0].total ?? 0,
    };
  },
);

import { getStatisticsTotalBalance } from "~~/server/database/actions";

export default defineEventHandler(
  async (event): Promise<ApiResponse<number>> => {
    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    const balance = await getStatisticsTotalBalance(db, user.id);

    return {
      error: false,
      ...httpStatusMessage[200],
      data: balance[0].total ?? 0,
    };
  },
);

import { startOfMonth, endOfMonth } from "date-fns";
import { getStatisticsTotalBalanceByType } from "~~/server/database/actions";

export default defineEventHandler(
  async (event): Promise<ApiResponse<number>> => {
    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    const startMonth = startOfMonth(new Date());
    const endMonth = endOfMonth(new Date());

    const totalBalance = await getStatisticsTotalBalanceByType(db, user.id, {
      isExpense: true,
      startDate: startMonth,
      endDate: endMonth,
    });

    return {
      error: false,
      ...httpStatusMessage[200],
      data: (totalBalance[0].total ?? 0) * -1,
    };
  },
);

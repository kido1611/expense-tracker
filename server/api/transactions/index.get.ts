import type { H3Event } from "h3";

import { getUserTransactions } from "~~/server/database/actions";

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<TransactionResponse[]>> => {
    const query = await getValidatedQuery(event, PaginationSchema.parse);

    const session = await requireUserSession(event);
    const user = await ensureUserIsAvailable(event, session);

    const transactions = await getUserTransactions(user.id, query);

    return {
      error: false,
      ...httpStatusMessage[200],
      data: transactions,
    };
  },
);

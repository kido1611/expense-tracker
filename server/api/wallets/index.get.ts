import type { H3Event } from "h3";
import { getUserWallets } from "~~/server/database/actions";

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<WalletResponse[]>> => {
    const session = await requireUserSession(event);
    const user = await ensureUserIsAvailable(event, session);

    const wallets = await getUserWallets(user.id);

    return {
      error: false,
      ...httpStatusMessage[200],
      data: wallets,
    };
  },
);

import { getUserWalletById } from "~~/server/database/actions";

export default defineEventHandler(
  async (event): Promise<ApiResponse<WalletResponse>> => {
    const validatedParams = await getValidatedRouterParams(
      event,
      WalletRouteParamSchema.parse,
    );

    const session = await requireUserSession(event);
    const user = await ensureUserIsAvailable(event, session);

    const wallet = await getUserWalletById(user.id, validatedParams.id);

    if (!wallet) {
      throw createError({
        ...httpStatusMessage[404],
        message: "Wallet not found",
      });
    }

    return {
      error: false,
      ...httpStatusMessage[200],
      data: {
        id: wallet.id,
        name: wallet.name,
        balance: wallet.balance,
        icon: wallet.icon,
        created_at: wallet.createdAt,
      },
    };
  },
);

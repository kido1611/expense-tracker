import {
  getUserWalletById,
  getUserCategoryByKey,
  createUserTransaction,
  updateUserWalletBalance,
} from "~~/server/database/actions";

export default defineEventHandler(
  async (event): Promise<ApiResponse<undefined>> => {
    const validatedParams = await getValidatedRouterParams(
      event,
      WalletRouteParamSchema.parse,
    );

    const validatedBody = await readValidatedBody(
      event,
      WalletAdjustBalanceCreateSchema.parse,
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

    const balanceDiff = validatedBody.balance - wallet.balance;

    if (balanceDiff !== 0) {
      const categoryKey =
        balanceDiff < 0 ? "expense_balance" : "income_balance";

      const category = await getUserCategoryByKey(user.id, categoryKey);

      if (!category) {
        throw createError({
          ...httpStatusMessage[500],
          message: "Category not found",
        });
      }

      await createUserTransaction({
        userId: user.id,
        walletId: wallet.id,
        categoryId: category.id,
        amount: balanceDiff,
        isVisibleInReport: true,
        transactionAt: new Date(),
        note: null,
      });

      await updateUserWalletBalance(user.id, wallet.id, validatedBody.balance);
    }
    // do nothing when newBalance is 0

    return {
      error: false,
      ...httpStatusMessage[200],
    };
  },
);

import type { H3Event } from "h3";

import { createUserWallet } from "~~/server/database/actions/wallet";
import { getUserCategoryByKey } from "~~/server/database/actions/category";
import { createUserTransaction } from "~~/server/database/actions/transaction";

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<WalletResponse>> => {
    const validatedBody = await readValidatedBody(
      event,
      WalletCreateSchema.parse,
    );

    const session = await requireUserSession(event);
    const user = await ensureUserIsAvailable(event, session);

    const wallet = await createUserWallet(user.id, validatedBody);

    // If balance != 0, add transaction
    if (validatedBody.balance > 0) {
      const category = await getUserCategoryByKey(user.id, "income_balance");

      if (category) {
        await createUserTransaction({
          userId: user.id,
          walletId: wallet.id,
          categoryId: category.id,
          amount: validatedBody.balance,
          isVisibleInReport: true,
          transactionAt: new Date(),
          note: null,
        });
      }
    }

    setResponseStatus(event, 201);
    return {
      error: false,
      ...httpStatusMessage[201],
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

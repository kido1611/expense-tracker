import type { H3Event } from "h3";
import { parseISO } from "date-fns";
import { ensureUserIsAvailable } from "~~/server/utils/session";

import {
  getUserWalletById,
  updateUserWalletBalance,
  createUserTransaction,
  getUserCategoryById,
} from "~~/server/database/actions";
import { httpStatusMessage } from "~~/server/utils/httpStatus";

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<TransactionResponse>> => {
    const validatedBody = await readValidatedBody(
      event,
      TransactionCreateSchema.parse,
    );

    const session = await requireUserSession(event);
    const user = await ensureUserIsAvailable(event, session);

    const wallet = await getUserWalletById(user.id, validatedBody.walletId);

    if (!wallet) {
      throw createError({
        ...httpStatusMessage[400],
        message: "Wallet not found",
      });
    }

    const category = await getUserCategoryById(
      user.id,
      validatedBody.categoryId,
    );

    if (!category) {
      throw createError({
        ...httpStatusMessage[400],
        message: "Category not found",
      });
    }

    const spendDate = parseISO(validatedBody.spendAt);
    const result = await createUserTransaction({
      ...validatedBody,
      amount: category.isExpense
        ? validatedBody.amount * -1
        : validatedBody.amount,
      spendAt: spendDate,
      userId: user.id,
    });

    await updateUserWalletBalance(
      user.id,
      wallet.id,
      wallet.balance -
        (category.isExpense ? validatedBody.amount : validatedBody.amount * -1),
    );

    setResponseStatus(event, 201);
    return {
      error: false,
      ...httpStatusMessage[201],
      data: {
        id: result.id,
        amount: result.amount,
        note: result.note,
        image_path: result.imagePath,
        spend_at: result.spendAt,
        is_visible_in_report: result.isVisibleInReport,
        is_wallet_transfer: false,
        created_at: result.createdAt,
        wallet: {
          id: wallet.id,
          balance:
            wallet.balance -
            (category.isExpense
              ? validatedBody.amount
              : validatedBody.amount * -1),
          name: wallet.name,
          icon: wallet.icon,
          created_at: wallet.createdAt,
        },
        category: {
          id: category.id,
          name: category.name,
          is_expense: category.isExpense,
          created_at: category.createdAt,
        },
      },
    };
  },
);

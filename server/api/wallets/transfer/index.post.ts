import { parseISO } from "date-fns";
import type { H3Event } from "h3";

import {
  getUserWalletById,
  getUserCategoryByKey,
  createUserTransactions,
  updateUserWalletBalance,
} from "~~/server/database/actions";

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<undefined>> => {
    const validatedBody = await readValidatedBody(
      event,
      WalletTransferCreateSchema.parse,
    );

    // Check user session
    const session = await requireUserSession(event);
    const user = await ensureUserIsAvailable(event, session);

    // Get Source Wallet
    const fromWallet = await getUserWalletById(
      user.id,
      validatedBody.fromWalletId,
    );

    if (!fromWallet) {
      throw createError({
        ...httpStatusMessage[400],
        message: "Wallet source is missing",
      });
    }

    // Get Target Wallet
    const toWallet = await getUserWalletById(user.id, validatedBody.toWalletId);

    if (!toWallet) {
      throw createError({
        ...httpStatusMessage[400],
        message: "Wallet target is missing",
      });
    }

    // Get outcome transfer category
    const outcomeTransferCategory = await getUserCategoryByKey(
      user.id,
      "expense_transfer",
    );

    if (!outcomeTransferCategory) {
      throw createError({
        ...httpStatusMessage[400],
        message: "Category expense is missing",
      });
    }

    // Get income transfer category
    const incomeTransferCategory = await getUserCategoryByKey(
      user.id,
      "income_transfer",
    );

    if (!incomeTransferCategory) {
      throw createError({
        ...httpStatusMessage[400],
        message: "Category income is missing",
      });
    }

    const transferDate = parseISO(validatedBody.transferAt);

    const transactions = [
      {
        userId: user.id,
        walletId: fromWallet.id,
        categoryId: outcomeTransferCategory.id,
        amount: validatedBody.amount * -1,
        isVisibleInReport: false,
        transactionAt: transferDate,
        note: validatedBody.note,
      },
      {
        userId: user.id,
        walletId: toWallet.id,
        categoryId: incomeTransferCategory.id,
        amount: validatedBody.amount,
        isVisibleInReport: false,
        transactionAt: transferDate,
        note: validatedBody.note,
      },
    ];

    if (validatedBody.withFee && validatedBody.feeAmount > 0) {
      // Get category for fee
      const otherTransferCategory = await getUserCategoryByKey(
        user.id,
        "expense_other",
      );

      if (otherTransferCategory) {
        transactions.push({
          userId: user.id,
          walletId: fromWallet.id,
          categoryId: otherTransferCategory.id,
          amount: validatedBody.feeAmount * -1,
          isVisibleInReport: true,
          transactionAt: transferDate,
          note: "Transfer Fee",
        });
      }
    }

    const insertResults = await createUserTransactions(transactions);

    const transactionOutcome = insertResults.filter(
      (data) => data.amount === validatedBody.amount * -1,
    )[0];
    const transactionIncome = insertResults.filter(
      (data) => data.amount === validatedBody.amount,
    )[0];
    const transactionFee = insertResults.filter(
      (data) =>
        validatedBody.withFee && data.amount === validatedBody.feeAmount * -1,
    )[0];

    await useDrizzle()
      .insert(tables.walletTransfers)
      .values({
        sourceTransactionId: transactionOutcome.id,
        targetTransactionId: transactionIncome.id,
        feeTransactionId: transactionFee ? transactionFee.id : null,
      });

    // Update balance of source wallet
    await updateUserWalletBalance(
      user.id,
      fromWallet.id,
      fromWallet.balance -
        validatedBody.amount -
        (validatedBody.withFee && validatedBody.feeAmount > 0
          ? validatedBody.feeAmount
          : 0),
    );

    // Update balance of target wallet
    await updateUserWalletBalance(
      user.id,
      toWallet.id,
      toWallet.balance + validatedBody.amount,
    );

    setResponseStatus(event, 201);

    return {
      error: false,
      ...httpStatusMessage[201],
    };
  },
);

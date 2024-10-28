import type { H3Event } from "h3";
import { walletTransferSchema } from "~/utils/zodSchema";
import { nanoid } from "nanoid";
import { getUserWalletByNanoid } from "~~/server/utils/wallet";
import { getUserCategoryBykey } from "~~/server/utils/category";

export default defineEventHandler(async (event: H3Event) => {
  const validatedBody = await readValidatedBody(
    event,
    walletTransferSchema.parse,
  );

  // Check user session
  const session = await requireUserSession(event);
  const user = await ensureUserIsAvailable(event, session);

  // Get Source Wallet
  const fromWallet = await getUserWalletByNanoid(
    user.id,
    validatedBody.fromWalletNanoid,
  );

  // Get Target Wallet
  const toWallet = await getUserWalletByNanoid(
    user.id,
    validatedBody.toWalletNanoid,
  );

  // Get outcome transfer category
  const outcomeTransferCategory = await getUserCategoryBykey(
    user.id,
    "expense_transfer",
  );

  // Get income transfer category
  const incomeTransferCategory = await getUserCategoryBykey(
    user.id,
    "income_transfer",
  );

  const transactions = [
    {
      userId: user.id,
      walletId: fromWallet.id,
      categoryId: outcomeTransferCategory.id,
      nanoid: nanoid(),
      amount: validatedBody.amount,
      realAmount: validatedBody.amount * -1,
      isVisibleInReport: false,
      spendAt: validatedBody.transferAt,
      note: validatedBody.note,
    },
    {
      userId: user.id,
      walletId: toWallet.id,
      categoryId: incomeTransferCategory.id,
      nanoid: nanoid(),
      amount: validatedBody.amount,
      realAmount: validatedBody.amount,
      isVisibleInReport: false,
      spendAt: validatedBody.transferAt,
      note: validatedBody.note,
    },
  ];

  if (validatedBody.withFee && validatedBody.feeAmount > 0) {
    // Get category for fee
    const otherTransferCategory = await getUserCategoryBykey(
      user.id,
      "expense_other",
    );

    transactions.push({
      userId: user.id,
      walletId: fromWallet.id,
      categoryId: otherTransferCategory.id,
      nanoid: nanoid(),
      amount: validatedBody.feeAmount,
      realAmount: validatedBody.feeAmount * -1,
      isVisibleInReport: true,
      spendAt: validatedBody.transferAt,
      note: "Transfer Fee",
    });
  }

  const insertResults = await useDrizzle()
    .insert(tables.transactions)
    .values(transactions)
    .returning();

  const transactionOutcome = insertResults.filter(
    (data) => data.realAmount === validatedBody.amount * -1,
  )[0];
  const transactionIncome = insertResults.filter(
    (data) => data.realAmount === validatedBody.amount,
  )[0];
  const transactionFee = insertResults.filter(
    (data) =>
      validatedBody.withFee && data.realAmount === validatedBody.feeAmount * -1,
  )[0];

  await useDrizzle()
    .insert(tables.walletTransfers)
    .values({
      sourceWalletId: fromWallet.id,
      sourceTransactionId: transactionOutcome?.id,
      targetWalletId: toWallet.id,
      targetTransactionId: transactionIncome?.id,
      feeTransactionId: transactionFee ? transactionFee.id : null,
    });

  // Update balance of source wallet
  await useDrizzle()
    .update(tables.wallets)
    .set({
      balance:
        fromWallet.balance -
        validatedBody.amount -
        (validatedBody.withFee && validatedBody.feeAmount > 0
          ? validatedBody.feeAmount
          : 0),
    })
    .where(eq(tables.wallets.id, fromWallet.id));

  // Update balance of target wallet
  await useDrizzle()
    .update(tables.wallets)
    .set({
      balance: toWallet.balance + validatedBody.amount,
    })
    .where(eq(tables.wallets.id, toWallet.id));

  return {
    user,
    validatedBody,
    fromWallet,
    insertResults,
    transactions: {
      transactionOutcome,
      transactionIncome,
      transactionFee,
    },
  };
});

import type { H3Event } from "h3";
import { eq, and, inArray } from "drizzle-orm";
import { transactionRouteParamSchema } from "~/utils/zodSchema";
import {
  deleteTransactionImage,
  getUserTransactionByNanoid,
} from "~~/server/utils/transaction";
import { getWalletTransferByTransactionId } from "~~/server/utils/walletTransfer";

export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    transactionRouteParamSchema.parse,
  );

  const session = await requireUserSession(event);
  const user = await ensureUserIsAvailable(event, session);

  const transaction = await getUserTransactionByNanoid(
    user.id,
    validatedParams.nanoid,
  );

  const walletTransfer = await getWalletTransferByTransactionId(transaction.id)

  const deleteTransactions = [];
  const updateWallets = new Map<number, number>();

  if (!walletTransfer) {
    deleteTransactions.push(transaction.id)

    updateWallets.set(transaction.walletId, transaction.realAmount * -1)

    await deleteTransactionImage(transaction)
  } else {
    const transactionIds = [
      walletTransfer.sourceTransactionId, walletTransfer.targetTransactionId,
      ...(walletTransfer.feeTransactionId ? [walletTransfer.feeTransactionId] : [])
    ];

    const transactions = await useDrizzle().query.transactions.findMany({
      where: and(
        eq(tables.transactions.userId, user.id),
        inArray(tables.transactions.id, transactionIds)
      )
    })

    transactions.forEach(item => {
      deleteTransactions.push(item.id)
      updateWallets.set(item.walletId, (updateWallets.get(item.walletId) ?? 0) - item.realAmount)
    });

    await useDrizzle().delete(tables.walletTransfers)
      .where(eq(tables.walletTransfers.id, walletTransfer.id))

    // TODO: Delete image transaction if exist
  }

  await useDrizzle().delete(tables.transactions)
    .where(and(
      inArray(tables.transactions.id, deleteTransactions),
      eq(tables.transactions.userId, user.id)
    ))

  updateWallets.forEach(async (value, key) => {
    await useDrizzle().update(tables.wallets)
      .set({
        balance: sql`${tables.wallets.balance} + ${value}`
      })
      .where(and(
        eq(tables.wallets.userId, user.id),
        eq(tables.wallets.id, key)
      ))
  })

  return {
    nanoid: transaction.nanoid,
    amount: transaction.amount,
    note: transaction.note,
    image_path: transaction.imagePath,
    spend_at: transaction.spendAt,
    is_visible_in_report: transaction.isVisibleInReport,
    created_at: transaction.createdAt,
  }
});

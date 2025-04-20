import type { H3Event } from "h3";
import { eq, and, inArray } from "drizzle-orm";
import {
  getUserTransactionById,
  getWalletTransferByTransactionId,
} from "~~/server/database/actions";

export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    TransactionRouteParamSchema.parse,
  );

  const session = await requireUserSession(event);
  const user = await ensureUserIsAvailable(event, session);

  const transaction = await getUserTransactionById(user.id, validatedParams.id);

  if (!transaction) {
    setResponseStatus(event, 404);
    return {
      status: "error",
      message: "Transaction is missing",
    };
  }

  const walletTransfer = await getWalletTransferByTransactionId(transaction.id);

  const deleteTransactions = [];
  const updateWallets = new Map<string, number>();

  if (!walletTransfer) {
    deleteTransactions.push(transaction.id);

    updateWallets.set(transaction.walletId, transaction.amount * -1);

    await deleteImage(transaction.imagePath);
  } else {
    const transactionIds = [
      walletTransfer.sourceTransactionId,
      walletTransfer.targetTransactionId,
      ...(walletTransfer.feeTransactionId
        ? [walletTransfer.feeTransactionId]
        : []),
    ];

    const transactions = await useDrizzle().query.transactions.findMany({
      where: and(
        eq(tables.transactions.userId, user.id),
        inArray(tables.transactions.id, transactionIds),
      ),
    });

    transactions.forEach((item) => {
      deleteTransactions.push(item.id);
      updateWallets.set(
        item.walletId,
        (updateWallets.get(item.walletId) ?? 0) - item.amount,
      );
    });

    await useDrizzle()
      .delete(tables.walletTransfers)
      .where(
        and(
          eq(
            tables.walletTransfers.sourceTransactionId,
            walletTransfer.sourceTransactionId,
          ),
          eq(
            tables.walletTransfers.targetTransactionId,
            walletTransfer.targetTransactionId,
          ),
        ),
      );

    // TODO: Delete image transaction if exist
  }

  await useDrizzle()
    .delete(tables.transactions)
    .where(
      and(
        inArray(tables.transactions.id, deleteTransactions),
        eq(tables.transactions.userId, user.id),
      ),
    );

  updateWallets.forEach(async (value, key) => {
    await useDrizzle()
      .update(tables.wallets)
      .set({
        balance: sql`${tables.wallets.balance} + ${value}`,
      })
      .where(
        and(eq(tables.wallets.userId, user.id), eq(tables.wallets.id, key)),
      );
  });

  setResponseStatus(event, 204);
});

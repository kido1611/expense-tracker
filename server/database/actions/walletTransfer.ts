import { eq, or, and } from "drizzle-orm";

export async function getWalletTransferByTransactionId(transactionId: string) {
  return await useDrizzle().query.walletTransfers.findFirst({
    where: or(
      eq(tables.walletTransfers.sourceTransactionId, transactionId),
      eq(tables.walletTransfers.targetTransactionId, transactionId),
      eq(tables.walletTransfers.feeTransactionId, transactionId),
    ),
  });
}

export async function deleteWalletTransfer(walletTransfer: WalletTransfer) {
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
}

export async function removeFeeWalletTransfer(walletTransfer: WalletTransfer) {
  await useDrizzle()
    .update(tables.walletTransfers)
    .set({
      feeTransactionId: null,
    })
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
}

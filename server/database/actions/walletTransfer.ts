import { eq } from "drizzle-orm";

export async function getWalletTransferByTransactionId(transactionId: string) {
  return await useDrizzle().query.walletTransfers.findFirst({
    where: or(
      eq(tables.walletTransfers.sourceTransactionId, transactionId),
      eq(tables.walletTransfers.targetTransactionId, transactionId),
      eq(tables.walletTransfers.feeTransactionId, transactionId),
    ),
  });
}

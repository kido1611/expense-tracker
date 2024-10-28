export async function getWalletTransferByTransactionId(
  transactionId: number
) {
  return await useDrizzle().query.walletTransfers.findFirst({
    where: or(
      eq(tables.walletTransfers.sourceTransactionId, transactionId),
      eq(tables.walletTransfers.targetTransactionId, transactionId),
      eq(tables.walletTransfers.feeTransactionId, transactionId),
    )
  })
}

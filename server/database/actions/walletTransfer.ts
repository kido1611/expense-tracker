import { eq, or, and } from "drizzle-orm";

export async function getWalletTransferByTransactionId(
  db: DrizzleDatabase,
  transactionId: string,
) {
  return await db.query.walletTransfers.findFirst({
    where: or(
      eq(tables.walletTransfers.sourceTransactionId, transactionId),
      eq(tables.walletTransfers.destinationTransactionId, transactionId),
      eq(tables.walletTransfers.feeTransactionId, transactionId),
    ),
  });
}

export async function deleteWalletTransfer(
  db: DrizzleDatabase,
  walletTransfer: WalletTransfer,
) {
  await db
    .delete(tables.walletTransfers)
    .where(
      and(
        eq(
          tables.walletTransfers.sourceTransactionId,
          walletTransfer.sourceTransactionId,
        ),
        eq(
          tables.walletTransfers.destinationTransactionId,
          walletTransfer.destinationTransactionId,
        ),
      ),
    );
}

export async function removeFeeWalletTransfer(
  db: DrizzleDatabase,
  walletTransfer: WalletTransfer,
) {
  await db
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
          tables.walletTransfers.destinationTransactionId,
          walletTransfer.destinationTransactionId,
        ),
      ),
    );
}

export async function createWalletTransfer(
  db: DrizzleDatabase,
  data: {
    sourceTransactionId: string;
    destinationTransactionId: string;
    feeTransactionId?: string | null;
  },
) {
  await db.insert(tables.walletTransfers).values({
    sourceTransactionId: data.sourceTransactionId,
    destinationTransactionId: data.destinationTransactionId,
    feeTransactionId: data.feeTransactionId,
  });
}

import type { H3Event } from "h3";
import {
  getUserTransactionById,
  getWalletTransferByTransactionId,
  getUserTransactionByIds,
  deleteUserTransactionsByIds,
  updateUserWalletRelativeBalance,
  deleteWalletTransfer,
  removeFeeWalletTransfer,
} from "~~/server/database/actions";

export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    TransactionRouteParamSchema.parse,
  );

  const session = await requireUserSession(event);
  const user = await ensureUserIsAvailable(event, session);

  // get transaction
  const transaction = await getUserTransactionById(user.id, validatedParams.id);

  if (!transaction) {
    throw createError({
      ...httpStatusMessage[404],
      message: "transaction not found",
    });
  }

  const db = useDrizzle();

  const deletedTransactionsIds: string[] = [];
  const updateWallets = new Map<string, number>();
  const imagePaths = new Set<string>();

  // -------------------------------------------------- Gathering data
  const walletTransfer = await getWalletTransferByTransactionId(
    db,
    transaction.id,
  );
  const isFeeWalletTransfer =
    walletTransfer?.feeTransactionId === transaction.id;

  if (walletTransfer && !isFeeWalletTransfer) {
    deletedTransactionsIds.push(walletTransfer.sourceTransactionId);
    deletedTransactionsIds.push(walletTransfer.targetTransactionId);
    if (walletTransfer.feeTransactionId) {
      deletedTransactionsIds.push(walletTransfer.feeTransactionId);
    }

    const transactions = await getUserTransactionByIds(
      db,
      user.id,
      deletedTransactionsIds,
    );
    for (const transaction of transactions) {
      updateWallets.set(
        transaction.walletId,
        (updateWallets.get(transaction.walletId) ?? 0) - transaction.amount,
      );

      if (transaction.imagePath) {
        imagePaths.add(transaction.imagePath);
      }
    }
  } else {
    deletedTransactionsIds.push(transaction.id);

    updateWallets.set(
      transaction.walletId,
      (updateWallets.get(transaction.walletId) ?? 0) - transaction.amount,
    );

    if (transaction.imagePath) {
      imagePaths.add(transaction.imagePath);
    }
  }

  // -------------------------------------------------- start delete data and images
  if (walletTransfer) {
    if (!isFeeWalletTransfer) {
      await deleteWalletTransfer(db, walletTransfer);
    } else {
      await removeFeeWalletTransfer(db, walletTransfer);
    }
  }

  await deleteUserTransactionsByIds(db, user.id, deletedTransactionsIds);

  for (const [key, value] of updateWallets) {
    await updateUserWalletRelativeBalance(db, key, value);
  }

  for (const path of imagePaths) {
    await deleteImage(path);
  }

  setResponseStatus(event, 204);
});

import type { H3Event } from "h3";
import {
  getUserTransactionById,
  getWalletTransferByTransactionId,
  getUserTransactionByIds,
  deleteUserTransactionsByIds,
  deleteWalletTransfer,
  removeFeeWalletTransfer,
} from "~~/server/database/actions";

defineRouteMeta({
  openAPI: {
    tags: ["Transactions"],
    description:
      "Delete user transaction(s). Also delete linked transaction (wallet transfer) if exists.",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "Transaction id",
        schema: {
          type: "string",
        },
        style: "simple",
        required: true,
      },
    ],
    responses: {
      "204": {
        description:
          "Success delete user transaction(s). Result always success even error because transaction is missing or owned by another user.",
      },
      "401": {
        description: "Unauthorized.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "boolean",
                },
                statusCode: {
                  type: "number",
                },
                statusMessage: {
                  type: "string",
                },
                message: {
                  type: "string",
                },
              },
            },
            example: {
              error: true,
              statusCode: 401,
              statusMessage: "Unauthorized",
              message: "Unauthorized",
            },
          },
        },
      },
    },
  },
});
export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    TransactionRouteParamSchema.parse,
  );

  const db = useDrizzle();
  const user = await ensureUserIsAvailable(event, db);

  // get transaction
  const transaction = await getUserTransactionById(
    db,
    user.id,
    validatedParams.id,
  );

  if (!transaction) {
    setResponseStatus(event, 204);
    return null;
  }

  const deletedTransactionsIds: string[] = [];
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
    deletedTransactionsIds.push(walletTransfer.destinationTransactionId);
    if (walletTransfer.feeTransactionId) {
      deletedTransactionsIds.push(walletTransfer.feeTransactionId);
    }

    const transactions = await getUserTransactionByIds(
      db,
      user.id,
      deletedTransactionsIds,
    );
    for (const transaction of transactions) {
      if (transaction.imagePath) {
        imagePaths.add(transaction.imagePath);
      }
    }
  } else {
    deletedTransactionsIds.push(transaction.id);

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

  await Promise.all([
    deleteUserTransactionsByIds(db, user.id, deletedTransactionsIds),
    ...[...imagePaths].map((path) => deleteImage(path)),
  ]);

  setResponseStatus(event, 204);
  return null;
});

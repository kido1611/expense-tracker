import consola from "consola";
import type { H3Event } from "h3";
import {
  getUserCategoryById,
  getUserTransactionById,
  getUserWalletById,
  getWalletTransferByTransactionId,
  updateUserTransactionById,
} from "~~/server/database/actions";
import {
  TransactionResponse,
  TransactionUpdateSchema,
} from "~~/shared/types/transaction";
import { ApiResponse } from "~~/shared/types/wrapper";

defineRouteMeta({
  openAPI: {
    tags: ["Transactions"],
    description:
      "Update user transaction. Also update linked transaction (wallet transfer) if exists.",
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
    requestBody: {
      description: "Update transaction",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              walletId: {
                type: "string",
              },
              categoryId: {
                type: "string",
              },
              amount: {
                type: "number",
              },
              note: {
                type: ["null", "string"],
              },
              transactionAt: {
                type: "string",
              },
              isVisibleInReport: {
                type: "boolean",
              },
            },
          },
          examples: {
            full: {
              description: "Example with full data",
              value: {
                walletId: "01974a61-73ee-724f-a5af-a00ac422c5e0",
                categoryId: "01974745-6fe7-7208-876c-049191477f0a",
                amount: 1000000,
                note: null,
                transactionAt: "2025-06-08",
                isVisibleInReport: true,
              },
            },
            minimal: {
              description: "Example with minimal data",
              value: {
                walletId: "01974a61-73ee-724f-a5af-a00ac422c5e0",
                categoryId: "01974745-6fe7-7208-876c-049191477f0a",
                amount: 500000,
                transactionAt: "2025-06-08",
              },
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Success update user transaction.",
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
                data: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    amount: {
                      type: "number",
                    },
                    note: {
                      type: ["null", "number"],
                    },
                    image_path: {
                      type: ["null", "string"],
                    },
                    transaction_at: {
                      type: "string",
                    },
                    is_wallet_transfer: {
                      type: "boolean",
                    },
                  },
                },
              },
            },
            example: {
              error: false,
              statusCode: 200,
              statusMessage: "OK",
              data: {
                id: "01974a61-a786-71ef-85e1-68eb14863cf8",
                amount: 1000000,
                note: null,
                image_path: null,
                transaction_at: "2025-06-07T12:33:23.334Z",
                is_visible_in_report: true,
                created_at: "2025-06-07T12:33:23.334Z",
                is_wallet_transfer: 0,
              },
            },
          },
        },
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
      "404": {
        description:
          "Transaction not found. Can be missing or tranasction is owned by another user.",
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
              statusCode: 404,
              statusMessage: "Not Found",
              message: "Transaction not found",
            },
          },
        },
      },
    },
  },
});
export default defineEventHandler(
  async (
    event: H3Event,
  ): Promise<ApiResponse<Omit<TransactionResponse, "wallet" | "category">>> => {
    const validatedParams = await getValidatedRouterParams(
      event,
      WalletRouteParamSchema.parse,
    );

    const validatedBody = await readValidatedBody(
      event,
      TransactionUpdateSchema.parse,
    );

    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    const transaction = await getUserTransactionById(
      db,
      user.id,
      validatedParams.id,
    );

    if (!transaction) {
      throw createError({
        ...httpStatusMessage[404],
        message: "Transaction not found",
      });
    }

    const data: Record<string, any> = {};
    if (validatedBody.walletId) {
      const wallet = await getUserWalletById(
        db,
        user.id,
        validatedBody.walletId,
      );

      if (!wallet) {
        throw createError({
          ...httpStatusMessage[422],
          message: "Wallet transaction not found",
        });
      }

      data["walletId"] = wallet.id;
    }

    if (validatedBody.categoryId) {
      const category = await getUserCategoryById(
        db,
        user.id,
        validatedBody.categoryId,
      );

      if (!category) {
        throw createError({
          ...httpStatusMessage[422],
          message: "Category transaction not found",
        });
      }

      data["categoryId"] = category.id;
    }

    if (validatedBody.amount !== undefined) {
      data["amount"] = validatedBody.amount;
    }
    if (validatedBody.transactionAt !== undefined) {
      data["transactionAt"] = parseStringDateToDate(
        validatedBody.transactionAt,
      );
    }
    if (validatedBody.note !== undefined) {
      data["note"] = validatedBody.note;
    }
    if (validatedBody.isVisibleInReport !== undefined) {
      data["isVisibleInReport"] = validatedBody.isVisibleInReport;
    }

    consola.info(data);

    const newTransaction = await updateUserTransactionById(
      db,
      user.id,
      transaction.id,
      data,
    );

    if (data.amount || data.transactionAt) {
      const walletTransfer = await getWalletTransferByTransactionId(
        db,
        transaction.id,
      );
      if (walletTransfer) {
        const linkedId =
          walletTransfer.sourceTransactionId === transaction.id
            ? walletTransfer.destinationTransactionId
            : walletTransfer.sourceTransactionId;
        await updateUserTransactionById(db, user.id, linkedId, {
          amount: newTransaction.amount,
          transactionAt: newTransaction.transactionAt,
          note: newTransaction.note,
        });
      }
    }

    return {
      error: false,
      ...httpStatusMessage[200],
      data: {
        id: newTransaction.id,
        amount: newTransaction.amount,
        note: newTransaction.note,
        image_path: newTransaction.imagePath,
        transaction_at: newTransaction.transactionAt,
        is_visible_in_report: newTransaction.isVisibleInReport,
        is_wallet_transfer: false,
        created_at: newTransaction.createdAt,
      },
    };
  },
);

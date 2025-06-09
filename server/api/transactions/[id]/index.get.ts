import type { H3Event } from "h3";
import {
  getUserCategoryById,
  getUserTransactionById,
  getUserWalletById,
  getWalletTransferByTransactionId,
} from "~~/server/database/actions";
import { TransactionResponse } from "~~/shared/types/transaction";
import { ApiResponse } from "~~/shared/types/wrapper";

defineRouteMeta({
  openAPI: {
    tags: ["Transactions"],
    description: "Get user transaction.",
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
      "200": {
        description: "Success get user transaction.",
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
                    wallet: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        name: {
                          type: "string",
                        },
                        icon: {
                          type: "string",
                        },
                        created_at: {
                          type: "string",
                        },
                      },
                    },
                    category: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        name: {
                          type: "string",
                        },
                        icon: {
                          type: "string",
                        },
                        is_expense: {
                          type: "boolean",
                        },
                        created_at: {
                          type: "string",
                        },
                      },
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
                wallet: {
                  id: "01974a61-a740-77dc-b289-be60463f41a5",
                  name: "Wallet A",
                  icon: "i-tabler-wallet",
                  created_at: "2025-06-07T12:33:23.264Z",
                },
                category: {
                  id: "01974745-6fe7-7208-876c-12f180cadf00",
                  name: "Adjust Balance",
                  icon: "i-hugeicons-money-receive-02",
                  is_expense: false,
                  created_at: "2025-06-06T22:03:42.439Z",
                },
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
  async (event: H3Event): Promise<ApiResponse<TransactionResponse>> => {
    const validatedParams = await getValidatedRouterParams(
      event,
      TransactionRouteParamSchema.parse,
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

    const wallet = await getUserWalletById(db, user.id, transaction.walletId);
    if (!wallet) {
      throw createError({
        ...httpStatusMessage[404],
        message: "Wallet Transaction not found",
      });
    }

    const category = await getUserCategoryById(
      db,
      user.id,
      transaction.categoryId,
    );
    if (!category) {
      throw createError({
        ...httpStatusMessage[404],
        message: "Category Transaction not found",
      });
    }

    const walletTransfer = await getWalletTransferByTransactionId(
      db,
      transaction.id,
    );

    return {
      error: false,
      ...httpStatusMessage[200],
      data: {
        id: transaction.id,
        amount: transaction.amount,
        transaction_at: transaction.transactionAt,
        is_visible_in_report: transaction.isVisibleInReport,
        is_wallet_transfer: !!walletTransfer,
        created_at: transaction.createdAt,
        note: transaction.note,
        image_path: transaction.imagePath,
        wallet: {
          id: wallet.id,
          name: wallet.name,
          icon: wallet.icon,
          created_at: wallet.created_at,
        },
        category: {
          id: category.id,
          name: category.name,
          icon: category.icon,
          is_expense: category.isExpense,
          created_at: category.createdAt,
        },
      },
    };
  },
);

import type { H3Event } from "h3";
import { ensureUserIsAvailable } from "~~/server/utils/session";

import {
  getUserWalletById,
  createUserTransaction,
  getUserCategoryById,
} from "~~/server/database/actions";
import { httpStatusMessage } from "~~/server/utils/httpStatus";
import { parseStringDateToDate } from "~~/shared/utils/date";

defineRouteMeta({
  openAPI: {
    tags: ["Transactions"],
    description: "Create a new user transaction.",
    requestBody: {
      description: "Create new transaction",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["walletId", "categoryId", "amount", "transactionAt"],
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
        description: "Success get user transactions.",
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
    },
  },
});

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<TransactionResponse>> => {
    const validatedBody = await readValidatedBody(
      event,
      TransactionCreateSchema.parse,
    );

    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    const wallet = await getUserWalletById(db, user.id, validatedBody.walletId);

    if (!wallet) {
      throw createError({
        ...httpStatusMessage[422],
        message: "Wallet not found",
      });
    }

    const category = await getUserCategoryById(
      db,
      user.id,
      validatedBody.categoryId,
    );

    if (!category) {
      throw createError({
        ...httpStatusMessage[422],
        message: "Category not found",
      });
    }

    const transactionDate = parseStringDateToDate(validatedBody.transactionAt);
    const result = await createUserTransaction(db, {
      ...validatedBody,
      transactionAt: transactionDate,
      userId: user.id,
    });

    setResponseStatus(event, 201);
    return {
      error: false,
      ...httpStatusMessage[201],
      data: {
        id: result.id,
        amount: result.amount,
        note: result.note,
        image_path: result.imagePath,
        transaction_at: result.transactionAt,
        is_visible_in_report: result.isVisibleInReport,
        is_wallet_transfer: false,
        created_at: result.createdAt,
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

import type { H3Event } from "h3";
import {
  createUserTransaction,
  getUserCategoryByKey,
  getUserWalletById,
  updateUserWalletById,
} from "~~/server/database/actions";

defineRouteMeta({
  openAPI: {
    tags: ["Wallets"],
    description: "Update user wallet by id.",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "Wallet id",
        schema: {
          type: "string",
        },
        style: "simple",
        required: true,
      },
    ],
    requestBody: {
      description: "Update user wallet.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                nullable: true,
              },
              balance: {
                type: "number",
                nullable: true,
              },
              icon: {
                type: "string",
                nullable: true,
              },
            },
          },
          examples: {
            full: {
              description: "Example with full data",
              value: {
                name: "Wallet A",
                balance: 1000000,
                icon: "i-tabler-wallet",
              },
            },
            "minimal name": {
              description: "Example with minimal data",
              value: {
                name: "wallet new name",
              },
            },
            "minimal balance": {
              description: "Example with minimal data2 ",
              value: {
                balance: 2000000,
              },
            },
            "minimal icon": {
              description: "Example with minimal data 3",
              value: {
                icon: "i-tabler-hearth",
              },
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Success update user wallet.",
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
                    name: {
                      type: "string",
                    },
                    icon: {
                      type: "string",
                    },
                    balance: {
                      type: "number",
                    },
                    created_at: {
                      type: "string",
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
                id: "01974935-6b76-70a8-9ec4-ee9b0ce987e2",
                name: "Wallet A",
                icon: "i-tabler-wallet",
                balance: 1000000,
                created_at: "2025-06-07T07:05:27.161Z",
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
          "Wallet not found. Can be missing or wallet is owned by another user.",
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
              message: "Wallet not found",
            },
          },
        },
      },
    },
  },
});
export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<WalletResponse>> => {
    const validatedParams = await getValidatedRouterParams(
      event,
      WalletRouteParamSchema.parse,
    );

    const validatedBody = await readValidatedBody(
      event,
      WalletUpdateSchema.parse,
    );

    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    const wallet = await getUserWalletById(db, user.id, validatedParams.id);

    if (!wallet) {
      throw createError({
        ...httpStatusMessage[404],
        message: "Wallet not found",
      });
    }

    if (validatedBody.name || validatedBody.icon) {
      await updateUserWalletById(db, user.id, wallet.id, validatedBody);
    }

    if (validatedBody.balance && validatedBody.balance != wallet.balance) {
      const diffBalance = validatedBody.balance - wallet.balance;
      const categoryKey =
        diffBalance < 0 ? "expense_balance" : "income_balance";

      const category = await getUserCategoryByKey(db, user.id, categoryKey);

      // Do nothing when category is missing
      if (category) {
        await createUserTransaction(db, {
          userId: user.id,
          walletId: wallet.id,
          categoryId: category.id,
          amount: diffBalance >= 0 ? diffBalance : diffBalance * -1,
          isVisibleInReport: true,
          transactionAt: new Date(),
          note: null,
        });
      }
    }

    return {
      error: false,
      ...httpStatusMessage[200],
      data: {
        id: wallet.id,
        name: validatedBody.name ?? wallet.name,
        icon: validatedBody.icon ?? wallet.icon,
        balance: validatedBody.balance ?? wallet.balance,
        created_at: wallet.created_at,
      },
    };
  },
);

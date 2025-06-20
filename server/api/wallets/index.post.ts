import type { H3Event } from "h3";

import { createUserWallet } from "~~/server/database/actions/wallet";
import { getUserCategoryByKey } from "~~/server/database/actions/category";
import { createUserTransaction } from "~~/server/database/actions/transaction";
import { Wallet, User } from "~~/server/utils/drizzle";

defineRouteMeta({
  openAPI: {
    tags: ["Wallets"],
    description: "Create a new user wallet.",
    requestBody: {
      description: "Create a new wallet.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: [name],
            properties: {
              name: {
                type: "string",
              },
              balance: {
                type: "number",
                default: 0,
                nullable: true,
              },
              icon: {
                type: "string",
                nullable: true,
                default: "i-tabler-wallet",
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
            minimal: {
              description: "Example with minimal data",
              value: {
                name: "wallet name",
              },
            },
          },
        },
      },
      required: true,
    },
    responses: {
      "201": {
        description: "Success create a wallet.",
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
              statusCode: 201,
              statusMessage: "Created",
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
    },
  },
});
export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<WalletResponse>> => {
    const validatedBody = await readValidatedBody(
      event,
      WalletCreateSchema.parse,
    );

    const db = useDrizzle();
    const user: User = await ensureUserIsAvailable(event, db);

    const wallet: Wallet = await createUserWallet(db, user.id, validatedBody);

    // If balance != 0, add transaction
    if (validatedBody.balance > 0) {
      const category = await getUserCategoryByKey(
        db,
        user.id,
        "income_balance",
      );

      if (category) {
        await createUserTransaction(db, {
          userId: user.id,
          walletId: wallet.id,
          categoryId: category.id,
          amount: validatedBody.balance,
          isVisibleInReport: true,
          transactionAt: new Date(),
          note: null,
        });
      }
    }

    setResponseStatus(event, 201);
    return {
      error: false,
      ...httpStatusMessage[201],
      data: {
        id: wallet.id,
        name: wallet.name,
        icon: wallet.icon,
        balance: validatedBody.balance,
        created_at: wallet.createdAt,
      },
    };
  },
);

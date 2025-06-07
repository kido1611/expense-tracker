import { getUserWalletById } from "~~/server/database/actions";

defineRouteMeta({
  openAPI: {
    tags: ["Wallets"],
    description: "Get user wallet by id.",
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
    responses: {
      "200": {
        description: "Success get user wallet.",
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
                id: "01974755-281e-70cd-bd48-eaf181cf26a4",
                name: "Wallet A",
                icon: "i-tabler-wallet",
                balance: 750000,
                created_at: "2025-06-06T22:20:52.639Z",
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
  async (event): Promise<ApiResponse<WalletResponse>> => {
    const validatedParams = await getValidatedRouterParams(
      event,
      WalletRouteParamSchema.parse,
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

    return {
      error: false,
      ...httpStatusMessage[200],
      data: wallet,
    };
  },
);

import type { H3Event } from "h3";
import { getUserWallets } from "~~/server/database/actions";

defineRouteMeta({
  openAPI: {
    tags: ["Wallets"],
    description: "Get all user wallets.",
    responses: {
      "200": {
        description: "Success get all user wallets.",
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
                  type: "array",
                  items: {
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
            },
            example: {
              error: false,
              statusCode: 200,
              statusMessage: "OK",
              data: [
                {
                  id: "01974755-281e-70cd-bd48-eaf181cf26a4",
                  name: "Wallet A",
                  icon: "i-tabler-wallet",
                  balance: 750000,
                  created_at: "2025-06-06T22:20:52.639Z",
                },
                {
                  id: "0197490e-4a97-7582-8e8d-e8590338e5b9",
                  name: "Wallet B",
                  icon: "i-tabler-wallet",
                  balance: 1000000,
                  created_at: "2025-06-07T06:22:42.839Z",
                },
              ],
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
  async (event: H3Event): Promise<ApiResponse<WalletResponse[]>> => {
    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    const wallets = await getUserWallets(db, user.id);

    return {
      error: false,
      ...httpStatusMessage[200],
      data: wallets,
    };
  },
);

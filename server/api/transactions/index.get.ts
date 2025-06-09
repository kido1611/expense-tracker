import type { H3Event } from "h3";

import { getUserTransactions } from "~~/server/database/actions";
import { TransactionResponse } from "~~/shared/types/transaction";
import { ApiResponse } from "~~/shared/types/wrapper";

defineRouteMeta({
  openAPI: {
    tags: ["Transactions"],
    description: "Get all user transactions.",
    parameters: [
      {
        name: "page",
        in: "query",
        description: "Page query",
        schema: {
          type: "number",
          default: 1,
          minimum: 1,
        },
        style: "form",
        required: false,
        allowEmptyValue: true,
      },
      {
        name: "limit",
        in: "query",
        description: "Data size query",
        schema: {
          type: "number",
          default: 20,
          minimum: 1,
        },
        style: "form",
        required: false,
        allowEmptyValue: true,
      },
    ],
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
                  type: "array",
                  items: {
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
            },
            example: {
              error: false,
              statusCode: 200,
              statusMessage: "OK",
              data: [
                {
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
                {
                  id: "01974a61-7475-77d8-a3fe-3beb2bc53fc6",
                  amount: 1000000,
                  note: null,
                  image_path: null,
                  transaction_at: "2025-06-07T12:33:10.261Z",
                  is_visible_in_report: true,
                  created_at: "2025-06-07T12:33:10.261Z",
                  is_wallet_transfer: 0,
                  wallet: {
                    id: "01974a61-73ee-724f-a5af-a00ac422c5e0",
                    name: "Wallet A",
                    icon: "i-tabler-wallet",
                    created_at: "2025-06-07T12:33:10.127Z",
                  },
                  category: {
                    id: "01974745-6fe7-7208-876c-12f180cadf00",
                    name: "Adjust Balance",
                    icon: "i-hugeicons-money-receive-02",
                    is_expense: false,
                    created_at: "2025-06-06T22:03:42.439Z",
                  },
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
  async (event: H3Event): Promise<ApiResponse<TransactionResponse[]>> => {
    const query = await getValidatedQuery(event, PaginationSchema.parse);

    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    const transactions = await getUserTransactions(db, user.id, query);

    return {
      error: false,
      ...httpStatusMessage[200],
      data: transactions,
    };
  },
);

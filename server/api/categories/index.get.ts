import type { H3Event } from "h3";

import { getUserCategories } from "~~/server/database/actions";

defineRouteMeta({
  openAPI: {
    tags: ["Categories"],
    description: "Get all user categories.",
    responses: {
      "200": {
        description: "Success get user categories.",
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
                        nullable: true,
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
            example: {
              error: false,
              statusCode: 200,
              statusMessage: "OK",
              data: [
                {
                  id: "01974745-6fe7-7208-876c-1cf343b8c6c0",
                  name: "Adjust Balance",
                  icon: "i-hugeicons-money-send-02",
                  is_expense: true,
                  created_at: "2025-06-06T22:03:42.439Z",
                },
                {
                  id: "01974745-6fe7-7208-876c-1477799b8ec8",
                  name: "Other Expense",
                  icon: "i-hugeicons-money-send-02",
                  is_expense: true,
                  created_at: "2025-06-06T22:03:42.439Z",
                },
                {
                  id: "01974745-6fe7-7208-876c-1b06220b721b",
                  name: "Outcoming Transfer",
                  icon: "i-hugeicons-money-send-02",
                  is_expense: true,
                  created_at: "2025-06-06T22:03:42.439Z",
                },
                {
                  id: "01974745-6fe7-7208-876c-12f180cadf00",
                  name: "Adjust Balance",
                  icon: "i-hugeicons-money-receive-02",
                  is_expense: false,
                  created_at: "2025-06-06T22:03:42.439Z",
                },
                {
                  id: "01974745-6fe7-7208-876c-0e5493038fcc",
                  name: "Incoming Transfer",
                  icon: "i-hugeicons-money-receive-02",
                  is_expense: false,
                  created_at: "2025-06-06T22:03:42.439Z",
                },
                {
                  id: "01974745-6fe7-7208-876c-08341a4a3278",
                  name: "Other Income",
                  icon: "i-hugeicons-money-receive-02",
                  is_expense: false,
                  created_at: "2025-06-06T22:03:42.439Z",
                },
                {
                  id: "01974745-6fe7-7208-876c-049191477f0a",
                  name: "Salary",
                  icon: "i-hugeicons-money-receive-02",
                  is_expense: false,
                  created_at: "2025-06-06T22:03:42.439Z",
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
  async (event: H3Event): Promise<ApiResponse<CategoryResponse[]>> => {
    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    const categories = await getUserCategories(db, user.id);

    return {
      error: false,
      ...httpStatusMessage[200],
      data: categories,
    };
  },
);

import type { H3Event } from "h3";
import { createUserCategory } from "~~/server/database/actions";
import {
  CategoryCreateSchema,
  CategoryResponse,
} from "~~/shared/types/category";
import { ApiResponse } from "~~/shared/types/wrapper";

defineRouteMeta({
  openAPI: {
    tags: ["Categories"],
    description: "Create a new user category.",
    requestBody: {
      required: true,
      description: "Create category",
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "isExpense"],
            properties: {
              name: {
                type: "string",
              },
              icon: {
                type: "string",
              },
              isExpense: {
                type: "boolean",
              },
            },
          },
          examples: {
            full: {
              description: "Example with full data",
              value: {
                name: "Category Expense A",
                isExpense: true,
                icon: "i-tabler-wallet",
              },
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Success create a category.",
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
            example: {
              error: false,
              statusCode: 200,
              statusMessage: "OK",
              data: {
                id: "01974745-6fe7-7208-876c-1cf343b8c6c0",
                name: "Adjust Balance",
                icon: "i-hugeicons-money-send-02",
                is_expense: true,
                created_at: "2025-06-06T22:03:42.439Z",
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
  async (event: H3Event): Promise<ApiResponse<CategoryResponse>> => {
    const validatedBody = await readValidatedBody(
      event,
      CategoryCreateSchema.parse,
    );

    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    const category = await createUserCategory(db, user.id, validatedBody);

    setResponseStatus(event, 201);
    return {
      error: false,
      ...httpStatusMessage[201],
      data: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        is_expense: category.isExpense,
        created_at: category.createdAt,
      },
    };
  },
);

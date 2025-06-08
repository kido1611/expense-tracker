import type { H3Event } from "h3";
import {
  getUserCategoryById,
  updateUserCategoryById,
} from "~~/server/database/actions";
import {
  CategoryResponse,
  CategoryUpdateSchema,
} from "~~/shared/types/category";
import { ApiResponse } from "~~/shared/types/wrapper";

defineRouteMeta({
  openAPI: {
    tags: ["Categories"],
    description: "Update user category.",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "Category id",
        schema: {
          type: "string",
        },
        style: "simple",
        required: true,
      },
    ],
    requestBody: {
      description: "Category",
      content: {
        "application/json": {
          schema: {
            type: "object",
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
                name: "Category Expense A Edit",
                isExpense: true,
                icon: "i-tabler-hearth",
              },
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Success update category.",
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
      "404": {
        description:
          "Category not found. Can be missing or category is owned by another user.",
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
              message: "Category not found",
            },
          },
        },
      },
    },
  },
});
export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<CategoryResponse>> => {
    const validatedParams = await getValidatedRouterParams(
      event,
      CategoryRouteParamSchema.parse,
    );
    const validatedBody = await readValidatedBody(
      event,
      CategoryUpdateSchema.parse,
    );

    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    const category = await getUserCategoryById(db, user.id, validatedParams.id);
    if (!category) {
      throw createError({
        ...httpStatusMessage[404],
        message: "Category not found",
      });
    }

    const newCategory = await updateUserCategoryById(
      db,
      user.id,
      validatedParams.id,
      validatedBody,
    );

    return {
      error: false,
      ...httpStatusMessage[200],
      data: {
        id: newCategory.id,
        name: newCategory.name,
        icon: newCategory.icon,
        is_expense: newCategory.isExpense,
        created_at: newCategory.createdAt,
      },
    };
  },
);

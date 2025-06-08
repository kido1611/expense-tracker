import type { H3Event } from "h3";
import { deleteUserCategoryById } from "~~/server/database/actions/category";
import { CategoryRouteParamSchema } from "~~/shared/types/category";

defineRouteMeta({
  openAPI: {
    tags: ["Categories"],
    description: "Delete user category.",
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
    responses: {
      "204": {
        description:
          "Success delete user category. Result still success even error because category is missing or owned by another user.",
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
  async (event: H3Event): Promise<undefined> => {
    const validatedParams = await getValidatedRouterParams(
      event,
      CategoryRouteParamSchema.parse,
    );

    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    await deleteUserCategoryById(db, user.id, validatedParams.id);

    // TODO: throw different error when deleting category contain key

    setResponseStatus(event, 204);
  },
);

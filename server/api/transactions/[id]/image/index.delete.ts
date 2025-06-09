import type { H3Event } from "h3";
import { deleteImage } from "~~/server/utils/nuxthub";
import {
  getUserTransactionById,
  updateUserTransactionById,
} from "~~/server/database/actions";

defineRouteMeta({
  openAPI: {
    tags: ["Transactions"],
    description: "Delete existing image of transaction.",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "Transaction id",
        schema: {
          type: "string",
        },
        style: "simple",
        required: true,
      },
    ],
    responses: {
      "204": {
        description: "Success delete image of transaction.",
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
          "Transaction not found. Can be missing or tranasction is owned by another user.",
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
              message: "Transaction not found",
            },
          },
        },
      },
    },
  },
});
export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    TransactionRouteParamSchema.parse,
  );

  const db = useDrizzle();
  const user = await ensureUserIsAvailable(event, db);

  const transaction = await getUserTransactionById(
    db,
    user.id,
    validatedParams.id,
  );

  if (transaction) {
    await Promise.all([
      deleteImage(transaction.imagePath),
      updateUserTransactionById(db, user.id, transaction.id, {
        imagePath: null,
      }),
    ]);
  }

  setResponseStatus(event, 204);
});

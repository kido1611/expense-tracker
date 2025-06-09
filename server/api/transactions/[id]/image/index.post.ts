import type { H3Event } from "h3";
import { v4 as uuidv4 } from "uuid";
import {
  getUserTransactionById,
  updateUserTransactionById,
} from "~~/server/database/actions";

defineRouteMeta({
  openAPI: {
    tags: ["Transactions"],
    description: "Upload image to transaction.",
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
        description: "Success upload image to transaction.",
      },
      "400": {
        description: "Bad Request. Failed validate image",
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
              statusCode: 400,
              statusMessage: "Bad Request",
              message: "No image provided",
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

  /**
   * read and validate image file
   */
  const form = await readFormData(event);
  const file = form.get("image") as File;

  if (!file || file.size === 0) {
    throw createError({
      ...httpStatusMessage[400],
      message: "No image provided",
    });
  }

  ensureBlob(file, {
    maxSize: "2MB",
    types: ["image"],
  });

  const db = useDrizzle();
  const user = await ensureUserIsAvailable(event, db);

  /**
   * Get transaction
   */
  const transaction = await getUserTransactionById(
    db,
    user.id,
    validatedParams.id,
  );
  if (!transaction) {
    throw createError({
      ...httpStatusMessage[404],
      message: "Transaction not found",
    });
  }

  /**
   * Upload image file
   */
  const extensions = file.name.split(".");
  const extension = extensions[extensions.length - 1];

  const fileName = uuidv4() + "." + extension;

  const path = await hubBlob().put(fileName, file, {
    prefix: `transactions/${transaction.id}/`,
  });

  await Promise.all([
    deleteImage(transaction?.imagePath),
    updateUserTransactionById(db, user.id, transaction.id, {
      imagePath: path.pathname,
    }),
  ]);

  setResponseStatus(event, 204);
});

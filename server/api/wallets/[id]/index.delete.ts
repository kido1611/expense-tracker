import type { H3Event } from "h3";

import { deleteUserWalletById } from "~~/server/database/actions";

defineRouteMeta({
  openAPI: {
    tags: ["Wallets"],
    description: "Delete user wallets.",
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
      "204": {
        description:
          "Success delete user wallet. Result still success even error because wallet is missing or owned by another user.",
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
export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    WalletRouteParamSchema.parse,
  );

  const db = useDrizzle();
  const user = await ensureUserIsAvailable(event, db);

  await deleteUserWalletById(db, user.id, validatedParams.id);

  setResponseStatus(event, 204);
});

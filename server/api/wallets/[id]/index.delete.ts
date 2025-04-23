import type { H3Event } from "h3";

import { deleteUserWalletById } from "~~/server/database/actions";

export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    WalletRouteParamSchema.parse,
  );

  const session = await requireUserSession(event);
  const user = await ensureUserIsAvailable(event, session);

  await deleteUserWalletById(user.id, validatedParams.id);

  setResponseStatus(event, 204);
});

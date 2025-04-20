import type { H3Event } from "h3";

import { z } from "zod";
import { deleteUserWalletById } from "~~/server/database/actions";

const routeParamSchema = z.object({
  id: z.uuid(),
});

export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    routeParamSchema.parse,
  );

  const session = await requireUserSession(event);
  const user = await ensureUserIsAvailable(event, session);

  await deleteUserWalletById(user.id, validatedParams.id);

  setResponseStatus(event, 204);
});

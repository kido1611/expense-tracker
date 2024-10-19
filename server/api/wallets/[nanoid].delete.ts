import type { H3Event } from "h3";

import { z } from "zod";

const zodParamSchema = z.object({
  nanoid: z.string().nanoid(),
});

export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    zodParamSchema.parse,
  );

  const session = await requireUserSession(event);
  const user = await ensureUserIsAvailable(event, session);

  const result = await useDrizzle()
    .delete(tables.wallets)
    .where(
      and(
        eq(tables.wallets.userId, user.id),
        eq(tables.wallets.nanoid, validatedParams.nanoid),
      ),
    )
    .returning({
      nanoid: tables.wallets.nanoid,
      balance: tables.wallets.balance,
      created_at: tables.wallets.createdAt,
    });
  return result;
});

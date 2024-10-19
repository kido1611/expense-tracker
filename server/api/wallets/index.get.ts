import { asc, eq } from "drizzle-orm";
import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const session = await getUserSession(event);

  const userId = session.user?.id;
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Unauthorized",
    });
  }

  const wallets = await useDrizzle()
    .select({
      nanoid: tables.wallets.nanoid,
      name: tables.wallets.name,
      balance: tables.wallets.balance,
      icon: tables.wallets.icon,
      created_at: tables.wallets.createdAt,
    })
    .from(tables.wallets)
    .where(eq(tables.wallets.userId, userId))
    .orderBy(asc(tables.wallets.name));

  return wallets;
});

import type { H3Event } from "h3";
import { eq, asc, desc } from "drizzle-orm";

export default defineEventHandler(async (event: H3Event) => {
  const session = await requireUserSession(event);
  const user = await ensureUserIsAvailable(event, session);

  const categories = await useDrizzle()
    .select({
      id: tables.categories.id,
      name: tables.categories.name,
      is_expense: tables.categories.isExpense,
      created_at: tables.categories.createdAt,
    })
    .from(tables.categories)
    .where(eq(tables.categories.userId, user.id))
    .orderBy(desc(tables.categories.isExpense), asc(tables.categories.name));

  return categories;
});

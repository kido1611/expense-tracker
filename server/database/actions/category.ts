import { eq, and, desc, asc } from "drizzle-orm";

export async function getUserCategoryByKey(
  userId: string,
  categoryKey: string,
) {
  const category = await useDrizzle().query.categories.findFirst({
    where: and(
      eq(tables.categories.userId, userId),
      eq(tables.categories.key, categoryKey),
    ),
  });

  return category;
}

export async function getUserCategoryById(userId: string, categoryId: string) {
  const category = await useDrizzle().query.categories.findFirst({
    where: and(
      eq(tables.categories.userId, userId),
      eq(tables.categories.id, categoryId),
    ),
  });

  return category;
}

export async function getUserCategories(userId: string) {
  const categories = await useDrizzle()
    .select({
      id: tables.categories.id,
      name: tables.categories.name,
      icon: tables.categories.icon,
      is_expense: tables.categories.isExpense,
      created_at: tables.categories.createdAt,
    })
    .from(tables.categories)
    .where(eq(tables.categories.userId, userId))
    .orderBy(desc(tables.categories.isExpense), asc(tables.categories.name));

  return categories;
}

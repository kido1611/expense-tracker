import { eq, and, desc, asc, isNull } from "drizzle-orm";
import {
  CategoryCreateType,
  CategoryUpdateType,
} from "~~/shared/types/category";

export async function getUserCategoryByKey(
  db: DrizzleDatabase,
  userId: string,
  categoryKey: string,
) {
  const category = await db.query.categories.findFirst({
    where: and(
      eq(tables.categories.userId, userId),
      eq(tables.categories.key, categoryKey),
    ),
  });

  return category;
}

export async function getUserCategoryById(
  db: DrizzleDatabase,
  userId: string,
  categoryId: string,
) {
  const category = await db.query.categories.findFirst({
    where: and(
      eq(tables.categories.userId, userId),
      eq(tables.categories.id, categoryId),
    ),
  });

  return category;
}

export async function getUserCategories(db: DrizzleDatabase, userId: string) {
  const categories = await db
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

export async function createUserCategory(
  db: DrizzleDatabase,
  userId: string,
  data: CategoryCreateType,
) {
  const [category] = await db
    .insert(tables.categories)
    .values({
      ...data,
      userId: userId,
    })
    .returning();

  return category;
}

export async function deleteUserCategoryById(
  db: DrizzleDatabase,
  userId: string,
  categoryId: string,
) {
  const result = await db
    .delete(tables.categories)
    .where(
      and(
        eq(tables.categories.userId, userId),
        eq(tables.categories.id, categoryId),
        isNull(tables.categories.key),
      ),
    )
    .returning();

  return result;
}

export async function updateUserCategoryById(
  db: DrizzleDatabase,
  userId: string,
  categoryId: string,
  data: CategoryUpdateType,
) {
  const [category] = await db
    .update(tables.categories)
    .set(data)
    .where(
      and(
        eq(tables.categories.userId, userId),
        eq(tables.categories.id, categoryId),
      ),
    )
    .returning();

  return category;
}

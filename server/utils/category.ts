export async function getUserCategoryBykey(
  userId: number,
  categoryKey: string,
) {
  const category = await useDrizzle().query.categories.findFirst({
    where: and(
      eq(tables.categories.key, categoryKey),
      eq(tables.categories.userId, userId),
    )
  })
  if (!category) {
    throw createError({
      statusCode: 400,
      message: "Category is missing",
    });
  }

  return category
}

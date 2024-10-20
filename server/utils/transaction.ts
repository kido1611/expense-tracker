export async function deleteTransactionImage(transaction: Transaction) {
  if (!transaction.imagePath) {
    return;
  }
  await hubBlob().delete(transaction.imagePath);
}

export async function getUserTransactionByNanoid(
  userId: number,
  transactionNanoid: string,
) {
  const transaction = await useDrizzle().query.transactions.findFirst({
    where: and(
      eq(tables.transactions.userId, userId),
      eq(tables.transactions.nanoid, transactionNanoid),
    ),
  });

  if (!transaction) {
    throw createError({
      statusCode: 404,
      message: "Transaction not found",
    });
  }

  return transaction;
}

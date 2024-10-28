export async function getUserWalletByNanoid(
  userId: number,
  walletNanoid: string,
) {
  const wallet = await useDrizzle().query.wallets.findFirst({
    where: and(
      eq(tables.wallets.nanoid, walletNanoid),
      eq(tables.wallets.userId, userId),
    )
  })

  if (!wallet) {
    throw createError({
      statusCode: 400,
      message: "Wallet source not found",
    });
  }

  return wallet
}

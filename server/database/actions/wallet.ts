import { eq, and, isNull, asc } from "drizzle-orm";

export async function createUserWallet(userId: string, data: WalletCreate) {
  const [wallet] = await useDrizzle()
    .insert(tables.wallets)
    .values({
      userId: userId,
      name: data.name,
      balance: data.balance,
      icon: data.icon,
    })
    .returning();

  return wallet;
}

export async function getUserWalletById(userId: string, walletId: string) {
  const wallet = await useDrizzle().query.wallets.findFirst({
    where: and(
      eq(tables.wallets.id, walletId),
      eq(tables.wallets.userId, userId),
    ),
  });

  return wallet;
}

export async function updateUserWalletBalance(
  userId: string,
  walletId: string,
  balance: number,
) {
  await useDrizzle()
    .update(tables.wallets)
    .set({
      balance: balance,
    })
    .where(
      and(eq(tables.wallets.id, walletId), eq(tables.wallets.userId, userId)),
    );
}

export async function updateUserWalletRelativeBalance(
  db: DrizzleDatabase,
  walletId: string,
  balance: number,
) {
  await db
    .update(tables.wallets)
    .set({
      balance: sql`${tables.wallets.balance} + ${balance}`,
    })
    .where(eq(tables.wallets.id, walletId));
}

export async function deleteUserWalletById(userId: string, walletId: string) {
  const result = await useDrizzle()
    .delete(tables.wallets)
    .where(
      and(eq(tables.wallets.userId, userId), eq(tables.wallets.id, walletId)),
    )
    .returning();

  return result;
}

export async function getUserWallets(userId: string) {
  const wallets = await useDrizzle()
    .select({
      id: tables.wallets.id,
      name: tables.wallets.name,
      balance: tables.wallets.balance,
      icon: tables.wallets.icon,
      created_at: tables.wallets.createdAt,
    })
    .from(tables.wallets)
    .where(
      and(eq(tables.wallets.userId, userId), isNull(tables.wallets.deletedAt)),
    )
    .orderBy(asc(tables.wallets.name));

  return wallets;
}

import { eq, and, isNull, asc } from "drizzle-orm";
import { WalletUpdate } from "~~/shared/types/wallet";

export async function createUserWallet(
  db: DrizzleDatabase,
  userId: string,
  data: WalletCreate,
) {
  const [wallet] = await db
    .insert(tables.wallets)
    .values({
      userId: userId,
      name: data.name,
      icon: data.icon,
    })
    .returning();

  return wallet;
}

export async function getUserWalletById(
  db: DrizzleDatabase,
  userId: string,
  walletId: string,
) {
  const [wallet] = await db
    .select({
      id: tables.wallets.id,
      name: tables.wallets.name,
      icon: tables.wallets.icon,
      balance: sql<number>`coalesce(sum(
          case 
            when categories.is_expense = 1 then -transactions.amount
            when categories.is_expense = 0 then transactions.amount
            else 0
          end
        ), 0) as balance`,
      created_at: tables.wallets.createdAt,
    })
    .from(tables.wallets)
    .leftJoin(
      tables.transactions,
      and(
        eq(tables.transactions.walletId, tables.wallets.id),
        eq(tables.transactions.isVisibleInReport, true),
      ),
    )
    .leftJoin(
      tables.categories,
      eq(tables.transactions.categoryId, tables.categories.id),
    )
    .where(
      and(
        eq(tables.wallets.id, walletId),
        eq(tables.wallets.userId, userId),
        isNull(tables.wallets.deletedAt),
      ),
    )
    .groupBy(tables.wallets.id, tables.wallets.name, tables.wallets.createdAt)
    .orderBy(asc(tables.wallets.name));

  return wallet;
}

export async function updateUserWalletById(
  db: DrizzleDatabase,
  userId: string,
  walletId: string,
  data: Omit<WalletUpdate, "balance">,
) {
  const [wallet] = await db
    .update(tables.wallets)
    .set(data)
    .where(
      and(eq(tables.wallets.id, walletId), eq(tables.wallets.userId, userId)),
    )
    .returning();

  return wallet;
}

export async function deleteUserWalletById(
  db: DrizzleDatabase,
  userId: string,
  walletId: string,
) {
  const result = await db
    .delete(tables.wallets)
    .where(
      and(eq(tables.wallets.userId, userId), eq(tables.wallets.id, walletId)),
    )
    .returning();

  return result;
}

export async function getUserWallets(db: DrizzleDatabase, userId: string) {
  const wallets = await db
    .select({
      id: tables.wallets.id,
      name: tables.wallets.name,
      icon: tables.wallets.icon,
      balance: sql<number>`coalesce(sum(
          case 
            when categories.is_expense = 1 then -transactions.amount
            when categories.is_expense = 0 then transactions.amount
            else 0
          end
        ), 0) as balance`,
      created_at: tables.wallets.createdAt,
    })
    .from(tables.wallets)
    .leftJoin(
      tables.transactions,
      and(
        eq(tables.transactions.walletId, tables.wallets.id),
        eq(tables.transactions.isVisibleInReport, true),
      ),
    )
    .leftJoin(
      tables.categories,
      eq(tables.transactions.categoryId, tables.categories.id),
    )
    .where(
      and(
        eq(tables.wallets.userId, userId),
        isNull(tables.wallets.deletedAt),
        eq(tables.transactions.isVisibleInReport, true),
      ),
    )
    .groupBy(tables.wallets.id, tables.wallets.name, tables.wallets.createdAt)
    .orderBy(asc(tables.wallets.name));

  return wallets;
}

// export async function getTotalWalletBalance(
//   db: DrizzleDatabase,
//   userId: string,
// ) {
//   return await db
//     .select({
//       total: sql<number>`coalesce(sum(
//           case
//             when categories.is_expense = 1 then -transactions.amount
//             when categories.is_expense = 0 then transactions.amount
//             else 0
//           end
//         ), 0) as balance`,
//     })
//     .from(tables.wallets)
//     .leftJoin(
//       tables.transactions,
//       and(
//         eq(tables.transactions.walletId, tables.wallets.id),
//         eq(tables.transactions.isVisibleInReport, true),
//       ),
//     )
//     .leftJoin(
//       tables.categories,
//       eq(tables.transactions.categoryId, tables.categories.id),
//     )
//     .where(
//       and(eq(tables.wallets.userId, userId), isNull(tables.wallets.deletedAt)),
//     );
// }

import { desc, eq, aliasedTable, inArray } from "drizzle-orm";

export async function createUserTransaction(data: TransactionInsert) {
  const [transaction] = await createUserTransactions([data]);

  return transaction;
}

export async function createUserTransactions(data: TransactionInsert[]) {
  const transactions = await useDrizzle()
    .insert(tables.transactions)
    .values(data)
    .returning();

  return transactions;
}

export async function getUserTransactionById(
  userId: string,
  transactionId: string,
) {
  const transaction = await useDrizzle().query.transactions.findFirst({
    where: and(
      eq(tables.transactions.userId, userId),
      eq(tables.transactions.id, transactionId),
    ),
  });

  return transaction;
}

export async function getUserTransactionByIds(
  db: DrizzleDatabase,
  userId: string,
  transactionIds: string[],
) {
  const transactions = await db.query.transactions.findMany({
    where: and(
      eq(tables.transactions.userId, userId),
      inArray(tables.transactions.id, transactionIds),
    ),
  });

  return transactions;
}

export async function removeTransactionImageById(transactionId: string) {
  await useDrizzle()
    .update(tables.transactions)
    .set({
      imagePath: null,
    })
    .where(eq(tables.transactions.id, transactionId));
}

export async function updateTransactionImageById(
  transactionId: string,
  imagePath: string,
) {
  await useDrizzle()
    .update(tables.transactions)
    .set({
      imagePath: imagePath,
    })
    .where(eq(tables.transactions.id, transactionId));
}

export async function getUserTransactions(
  userId: string,
  pagination: Pagination,
) {
  const sourceWalletTransfer = aliasedTable(
    tables.walletTransfers,
    "source_wallet_transfer",
  );
  const targetWalletTransfer = aliasedTable(
    tables.walletTransfers,
    "target_wallet_transfer",
  );
  const feeWalletTransfer = aliasedTable(
    tables.walletTransfers,
    "fee_wallet_transfer",
  );
  const transactions = await useDrizzle()
    .select({
      id: tables.transactions.id,
      amount: tables.transactions.amount,
      note: tables.transactions.note,
      image_path: tables.transactions.imagePath,
      spend_at: tables.transactions.spendAt,
      is_visible_in_report: tables.transactions.isVisibleInReport,
      created_at: tables.transactions.createdAt,
      is_wallet_transfer: sql<boolean>`${sourceWalletTransfer.sourceTransactionId} is not null or ${targetWalletTransfer.targetTransactionId} is not null or ${feeWalletTransfer.feeTransactionId} is not null`,
      wallet: {
        id: tables.wallets.id,
        name: tables.wallets.name,
        balance: tables.wallets.balance,
        icon: tables.wallets.icon,
        created_at: tables.wallets.createdAt,
      },
      category: {
        id: tables.categories.id,
        name: tables.categories.name,
        is_expense: tables.categories.isExpense,
        created_at: tables.categories.createdAt,
      },
    })
    .from(tables.transactions)
    .innerJoin(
      tables.categories,
      eq(tables.transactions.categoryId, tables.categories.id),
    )
    .innerJoin(
      tables.wallets,
      eq(tables.transactions.walletId, tables.wallets.id),
    )
    .leftJoin(
      sourceWalletTransfer,
      eq(tables.transactions.id, sourceWalletTransfer.sourceTransactionId),
    )
    .leftJoin(
      targetWalletTransfer,
      eq(tables.transactions.id, targetWalletTransfer.targetTransactionId),
    )
    .leftJoin(
      feeWalletTransfer,
      eq(tables.transactions.id, feeWalletTransfer.feeTransactionId),
    )
    .where(eq(tables.transactions.userId, userId))
    .orderBy(
      desc(tables.transactions.createdAt),
      desc(tables.transactions.spendAt),
      desc(tables.transactions.id),
    )
    .limit(pagination.limit)
    .offset(pagination.limit * (pagination.page - 1));

  return transactions;
}

export async function deleteUserTransactionsByIds(
  db: DrizzleDatabase,
  userId: string,
  transactionIds: string[],
) {
  await db
    .delete(tables.transactions)
    .where(
      and(
        eq(tables.transactions.userId, userId),
        inArray(tables.transactions.id, transactionIds),
      ),
    );
}

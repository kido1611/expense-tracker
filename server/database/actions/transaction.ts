import { desc, eq, aliasedTable, inArray, gte, lte } from "drizzle-orm";
import { DrizzleDatabase } from "~~/server/utils/drizzle";
import {
  TransactionUpdateType,
  StatisticBalanceOptions,
  StatisticBalanceByTypeOptions,
} from "~~/shared/types/transaction";

export async function createUserTransaction(
  db: DrizzleDatabase,
  data: TransactionInsert,
) {
  const [transaction] = await createUserTransactions(db, [data]);

  return transaction;
}

export async function createUserTransactions(
  db: DrizzleDatabase,
  data: TransactionInsert[],
) {
  const transactions = await db
    .insert(tables.transactions)
    .values(data)
    .returning();

  return transactions;
}

export async function getUserTransactionById(
  db: DrizzleDatabase,
  userId: string,
  transactionId: string,
) {
  const transaction = await db.query.transactions.findFirst({
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

export async function getUserTransactions(
  db: DrizzleDatabase,
  userId: string,
  pagination: Pagination,
) {
  const sourceWalletTransfer = aliasedTable(
    tables.walletTransfers,
    "source_wallet_transfer",
  );
  const destinationWalletTransfer = aliasedTable(
    tables.walletTransfers,
    "target_wallet_transfer",
  );
  const feeWalletTransfer = aliasedTable(
    tables.walletTransfers,
    "fee_wallet_transfer",
  );
  const transactions = await db
    .select({
      id: tables.transactions.id,
      amount: tables.transactions.amount,
      note: tables.transactions.note,
      image_path: tables.transactions.imagePath,
      transaction_at: tables.transactions.transactionAt,
      is_visible_in_report: tables.transactions.isVisibleInReport,
      created_at: tables.transactions.createdAt,
      is_wallet_transfer: sql<boolean>`${sourceWalletTransfer.sourceTransactionId} is not null or ${destinationWalletTransfer.destinationTransactionId} is not null or ${feeWalletTransfer.feeTransactionId} is not null`,
      wallet: {
        id: tables.wallets.id,
        name: tables.wallets.name,
        icon: tables.wallets.icon,
        created_at: tables.wallets.createdAt,
      },
      category: {
        id: tables.categories.id,
        name: tables.categories.name,
        icon: tables.categories.icon,
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
      destinationWalletTransfer,
      eq(
        tables.transactions.id,
        destinationWalletTransfer.destinationTransactionId,
      ),
    )
    .leftJoin(
      feeWalletTransfer,
      eq(tables.transactions.id, feeWalletTransfer.feeTransactionId),
    )
    .where(eq(tables.transactions.userId, userId))
    .orderBy(
      desc(tables.transactions.transactionAt),
      desc(tables.transactions.createdAt),
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

export async function updateUserTransactionById(
  db: DrizzleDatabase,
  userId: string,
  transactionId: string,
  data: TransactionUpdateType,
) {
  const [transaction] = await db
    .update(tables.transactions)
    .set(data)
    .where(
      and(
        eq(tables.transactions.userId, userId),
        eq(tables.transactions.id, transactionId),
      ),
    )
    .returning();

  return transaction;
}

export async function getStatisticsTotalBalance(
  db: DrizzleDatabase,
  userId: string,
  options: StatisticBalanceOptions = {},
) {
  return await db
    .select({
      total: sql<number>`coalesce(sum(
          case 
            when categories.is_expense = 1 then -transactions.amount
            when categories.is_expense = 0 then transactions.amount
            else 0
          end
        ), 0) as balance`,
    })
    .from(tables.transactions)
    .innerJoin(
      tables.categories,
      eq(tables.transactions.categoryId, tables.categories.id),
    )
    .where(
      and(
        eq(tables.transactions.userId, userId),
        eq(tables.transactions.isVisibleInReport, true),
        options.startDate
          ? gte(tables.transactions.transactionAt, options.startDate)
          : undefined,
        options.endDate
          ? lte(tables.transactions.transactionAt, options.endDate)
          : undefined,
      ),
    );
}

export async function getStatisticsTotalBalanceByType(
  db: DrizzleDatabase,
  userId: string,
  options: StatisticBalanceByTypeOptions,
) {
  return await db
    .select({
      total: sql<number>`coalesce(sum(
          case 
            when categories.is_expense = 1 then -transactions.amount
            when categories.is_expense = 0 then transactions.amount
            else 0
          end
        ), 0) as balance`,
    })
    .from(tables.transactions)
    .innerJoin(
      tables.categories,
      and(
        eq(tables.transactions.categoryId, tables.categories.id),
        eq(tables.categories.isExpense, options.isExpense),
      ),
    )
    .where(
      and(
        eq(tables.transactions.userId, userId),
        eq(tables.transactions.isVisibleInReport, true),
        options.startDate
          ? gte(tables.transactions.transactionAt, options.startDate)
          : undefined,
        options.endDate
          ? lte(tables.transactions.transactionAt, options.endDate)
          : undefined,
      ),
    );
}

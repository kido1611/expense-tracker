import {
  sqliteTable,
  text,
  integer,
  index,
  foreignKey,
  primaryKey,
} from "drizzle-orm/sqlite-core";

import { v7 as uuidv7 } from "uuid";

// ------------------------------------------------------------------- predefined data-type
const uuidAsId = text("id").primaryKey().$defaultFn(uuidv7);
const createdAt = integer("created_at", {
  mode: "timestamp_ms",
})
  .notNull()
  .$defaultFn(() => new Date());
const updatedAt = integer("updated_at", {
  mode: "timestamp_ms",
})
  .notNull()
  .$defaultFn(() => new Date())
  .$onUpdateFn(() => new Date());
const deletedAt = integer("deleted_at", {
  mode: "timestamp_ms",
});

// ------------------------------------------------------------------- schema
export const users = sqliteTable("users", {
  id: uuidAsId,
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: createdAt,
  updatedAt: updatedAt,
  deletedAt: deletedAt,
});

export const wallets = sqliteTable(
  "wallets",
  {
    id: uuidAsId,
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    icon: text("icon"),
    createdAt: createdAt,
    updatedAt: updatedAt,
    disabledAt: integer("disabled_at", { mode: "timestamp_ms" }),
    deletedAt: deletedAt,
  },
  (table) => [
    index("wallets_user_id_idx").on(table.userId),
    index("wallets_name_idx").on(table.name),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "wallets_user_id_foreign",
    }).onDelete("cascade"),
  ],
);

export const budgets = sqliteTable(
  "budgets",
  {
    id: uuidAsId,
    userId: text("user_id").notNull(),
    amount: integer("amount").notNull().default(0),
    type: text("type").notNull(), // recurring/one-time
    createdAt: createdAt,
    updatedAt: updatedAt,
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "budgets_user_id_foreign",
    }).onDelete("cascade"),
  ],
);

export const categories = sqliteTable(
  "categories",
  {
    id: uuidAsId,
    userId: text("user_id").notNull(),
    // key will be used to auto detect category when transaction is created by system
    // like transfer, adjust balance, create wallet, etc.
    key: text("key"),
    name: text("name").notNull(),
    isExpense: integer("is_expense", { mode: "boolean" })
      .notNull()
      .default(false),
    icon: text("icon"),
    sortOrder: integer("sort_order").default(1),
    createdAt: createdAt,
    updatedAt: updatedAt,
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "categories_user_id_foreign",
    }).onDelete("cascade"),
  ],
);

export const transactions = sqliteTable(
  "transactions",
  {
    id: uuidAsId,
    userId: text("user_id").notNull(),
    walletId: text("wallet_id").notNull(),
    categoryId: text("category_id").notNull(),
    budgetId: text("budget_id"),

    //  store absoslute amount
    amount: integer("amount").notNull().default(0),
    imagePath: text("image_path"),
    note: text("note"),
    // form has option to hide transaction from report. Used on transfer balance between wallet
    isVisibleInReport: integer("is_visible_in_report", {
      mode: "boolean",
    })
      .notNull()
      .default(true),

    transactionAt: integer("transaction_at", {
      mode: "timestamp_ms",
    }).notNull(),

    createdAt: createdAt,
    updatedAt: updatedAt,
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "transactions_user_id_foreign",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.walletId],
      foreignColumns: [wallets.id],
      name: "transactions_wallet_id_foreign",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "transactions_category_id_foreign",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.budgetId],
      foreignColumns: [budgets.id],
      name: "transactions_budget_id_foreign",
    }).onDelete("set null"),
  ],
);

export const budgetTransactions = sqliteTable(
  "budget_transactions",
  {
    transactionId: text("transaction_id").notNull(),
    budgetId: text("budget_id").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.transactionId, table.budgetId],
    }),
  ],
);

export const walletTransfers = sqliteTable(
  "wallet_transfers",
  {
    sourceTransactionId: text("source_transaction_id").notNull(),
    destinationTransactionId: text("destination_transaction_id").notNull(),
    feeTransactionId: text("fee_transaction_id"),
  },
  (table) => [
    primaryKey({
      columns: [table.sourceTransactionId, table.destinationTransactionId],
    }),
    foreignKey({
      columns: [table.sourceTransactionId],
      foreignColumns: [transactions.id],
      name: "wallet_transfers_source_transaction_id_foreign",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.destinationTransactionId],
      foreignColumns: [transactions.id],
      name: "wallet_transfers_destination_transaction_id_foreign",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.feeTransactionId],
      foreignColumns: [transactions.id],
      name: "wallet_transfers_fee_transaction_id_foreign",
    }).onDelete("set null"),
  ],
);

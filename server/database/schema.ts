import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const wallets = sqliteTable(
  "wallets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    nanoid: text("nanoid").notNull().unique(),
    name: text("name").notNull(),
    balance: integer("balance").notNull().default(0),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => {
    return {
      nanoidIdx: index("wallets_nanoid_idx").on(table.nanoid),
      nameIdx: index("wallets_name_idx").on(table.name),
    };
  },
);

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  isExpense: integer("is_expense", { mode: "boolean" }).default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const transactions = sqliteTable(
  "transactions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    walletId: integer("wallet_id")
      .notNull()
      .references(() => wallets.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),

    nanoid: text("nanoid").notNull().unique(),
    amount: integer("amount").notNull().default(0),
    note: text("note"),
    isVisibleInReport: integer("is_visible_in_report", {
      mode: "boolean",
    }).default(true),

    spendAt: text("spend_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => {
    return {
      nanoidIdx: index("transactions_nanoid_idx").on(table.nanoid),
    };
  },
);

export const walletTransfers = sqliteTable("wallet_transfers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceWalletId: integer("source_wallet_id")
    .notNull()
    .references(() => wallets.id),
  sourceTransactionId: integer("source_transaction_id")
    .notNull()
    .references(() => transactions.id),
  targetWalletId: integer("target_wallet_id")
    .notNull()
    .references(() => wallets.id),
  targetTransactionId: integer("target_transaction_id")
    .notNull()
    .references(() => transactions.id),
  feeTransactionId: integer("fee_transaction_id").references(
    () => transactions.id,
  ),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

// TODO: table ledger

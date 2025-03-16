import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  foreignKey,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
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
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => {
    return {
      uuidIdx: index("users_uuid_idx").on(table.uuid),
    };
  },
);

export const wallets = sqliteTable(
  "wallets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull(),
    nanoid: text("nanoid").notNull().unique(),
    name: text("name").notNull(),
    balance: integer("balance").notNull().default(0),
    icon: text("icon"),
    sortOrder: integer("sort_order").default(1),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => {
    return {
      nanoidIdx: index("wallets_nanoid_idx").on(table.nanoid),
      userIdIdx: index("wallets_user_id_idx").on(table.userId),
      nameIdx: index("wallets_name_idx").on(table.name),
      userReference: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "wallets_user_id_foreign",
      }).onDelete("cascade"),
    };
  },
);

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull(),
    // key will be used to auto detect category when transaction is created by system
    // like transfer, adjust balance, create wallet, etc.
    key: text("key"),
    name: text("name").notNull(),
    isExpense: integer("is_expense", { mode: "boolean" }).default(false),
    icon: text("icon"),
    sortOrder: integer("sort_order").default(1),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => {
    return {
      userReference: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "categories_user_id_foreign",
      }).onDelete("cascade"),
    };
  },
);

export const transactions = sqliteTable(
  "transactions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull(),
    walletId: integer("wallet_id").notNull(),
    categoryId: integer("category_id").notNull(),

    nanoid: text("nanoid").notNull().unique(),
    //  store absoslute amount
    amount: integer("amount").notNull().default(0),
    // store signed amount
    realAmount: integer("real_amount").notNull().default(0),
    imagePath: text("image_path"),
    note: text("note"),
    // form has option to hide transaction from report
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
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => {
    return {
      nanoidIdx: index("transactions_nanoid_idx").on(table.nanoid),
      userReference: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "transactions_user_id_foreign",
      }).onDelete("cascade"),
      walletReference: foreignKey({
        columns: [table.walletId],
        foreignColumns: [wallets.id],
        name: "transactions_wallet_id_foreign",
      }).onDelete("cascade"),
      categoryReference: foreignKey({
        columns: [table.categoryId],
        foreignColumns: [categories.id],
        name: "transactions_category_id_foreign",
      }).onDelete("cascade"),
    };
  },
);

export const walletTransfers = sqliteTable(
  "wallet_transfers",
  {
    sourceTransactionId: integer("source_transaction_id").notNull(),
    targetTransactionId: integer("target_transaction_id").notNull(),
    feeTransactionId: integer("fee_transaction_id"),
  },
  (table) => {
    return {
      primaryKey: primaryKey({
        columns: [table.sourceTransactionId, table.targetTransactionId],
      }),
      sourceTransactionReference: foreignKey({
        columns: [table.sourceTransactionId],
        foreignColumns: [transactions.id],
        name: "wallet_transfers_source_transaction_id_foreign",
      }).onDelete("cascade"),
      targetTransactionReference: foreignKey({
        columns: [table.targetTransactionId],
        foreignColumns: [transactions.id],
        name: "wallet_transfers_target_transaction_id_foreign",
      }).onDelete("cascade"),
      feeTransactionReference: foreignKey({
        columns: [table.feeTransactionId],
        foreignColumns: [transactions.id],
        name: "wallet_transfers_fee_transaction_id_foreign",
      }).onDelete("set null"),
    };
  },
);

// TODO: table ledger

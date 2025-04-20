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
    balance: integer("balance").notNull().default(0),
    icon: text("icon"),
    sortOrder: integer("sort_order").default(1),
    createdAt: createdAt,
    updatedAt: updatedAt,
    disabledAt: integer("disabled_at", { mode: "timestamp_ms" }),
    deletedAt: deletedAt,
  },
  (table) => {
    return {
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

export const budgets = sqliteTable(
  "budgets",
  {
    id: uuidAsId,
    userId: text("user_id").notNull(),
    amount: integer("amount").notNull().default(0),
    createdAt: createdAt,
    updatedAt: updatedAt,
  },
  (table) => {
    return {
      userReference: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "budgets_user_id_foreign",
      }).onDelete("cascade"),
    };
  },
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

    spendAt: integer("spend_at", { mode: "timestamp_ms" }).notNull(),

    createdAt: createdAt,
    updatedAt: updatedAt,
  },
  (table) => {
    return {
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
      budgetReference: foreignKey({
        columns: [table.budgetId],
        foreignColumns: [budgets.id],
        name: "transactions_budget_id_foreign",
      }).onDelete("set null"),
    };
  },
);

export const walletTransfers = sqliteTable(
  "wallet_transfers",
  {
    sourceTransactionId: text("source_transaction_id").notNull(),
    targetTransactionId: text("target_transaction_id").notNull(),
    feeTransactionId: text("fee_transaction_id"),
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

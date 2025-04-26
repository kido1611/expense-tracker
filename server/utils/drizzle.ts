import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "../database/schema";

export type { DrizzleD1Database } from "drizzle-orm/d1";
export { sql, eq, and, or, gte, lt } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}

export type User = typeof schema.users.$inferSelect;
export type Wallet = typeof schema.wallets.$inferSelect;
export type Category = typeof schema.categories.$inferSelect;
export type Transaction = typeof schema.transactions.$inferSelect;
export type WalletTransfer = typeof schema.walletTransfers.$inferSelect;

export type DrizzleDatabase = DrizzleD1Database<typeof schema>;
// export type DBTransaction = Parameters<
//   Parameters<DrizzleD1Database<typeof schema>["transaction"]>[0]
// >[0];

import { drizzle } from "drizzle-orm/d1";

import * as schema from "../database/schema";
export { sql, eq, and, or } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}

export type User = typeof schema.users.$inferSelect;
export type Wallet = typeof schema.wallets.$inferSelect;
export type Category = typeof schema.categories.$inferSelect;
export type Transaction = typeof schema.transactions.$inferSelect;
export type WalletTransfer = typeof schema.walletTransfers.$inferSelect;

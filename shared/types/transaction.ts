import { z } from "zod/v4";
import type { WalletResponse } from "./wallet";
import type { CategoryResponse } from "./category";

export const TransactionCreateSchema = z.object({
  walletId: z.uuid(),
  categoryId: z.uuid(),
  amount: z.coerce.number(),
  note: z.string().max(200).nullish(),
  transactionAt: z.union([z.date(), z.iso.date(), z.iso.datetime()]),
  isVisibleInReport: z.boolean().default(true),
});

export type TransactionCreate = z.output<typeof TransactionCreateSchema>;

export type TransactionInsert = TransactionCreate & {
  userId: string;
};

export type TransactionResponse = {
  id: string;
  amount: number;
  note?: string | null;
  image_path?: string | null;
  transaction_at: Date | string;
  is_visible_in_report: boolean;
  is_wallet_transfer?: boolean | null;
  created_at: Date | string;
  wallet: WalletResponse;
  category: CategoryResponse;
};

export const TransactionRouteParamSchema = z.object({
  id: z.uuid(),
});

import { z } from "zod";
import type { WalletResponse } from "./wallet";
import type { CategoryResponse } from "./category";

export const TransactionCreateSchema = z.object({
  walletId: z.uuid(),
  categoryId: z.uuid(),
  amount: z.coerce.number(),
  note: z.string().max(200).nullish(),
  spendAt: z.iso.date(),
  isVisibleInReport: z.boolean().default(true),
});

export type TransactionCreate = z.output<typeof TransactionCreateSchema>;

export type TransactionInsert = Omit<TransactionCreate, "spendAt"> & {
  userId: string;
  spendAt: Date;
};

export type TransactionResponse = {
  id: string;
  amount: number;
  note: string | null | undefined;
  image_path: string | null | undefined;
  spend_at: Date | string;
  is_visible_in_report: boolean;
  is_wallet_transfer: boolean | null | undefined;
  created_at: Date | string;
  wallet: WalletResponse;
  category: CategoryResponse;
};

export const TransactionRouteParamSchema = z.object({
  id: z.uuid(),
});

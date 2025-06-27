import { z } from "zod/v4";
import type { WalletResponse } from "./wallet";
import type { CategoryResponse } from "./category";

const zodDate = z.union([
  z.date(),
  z.iso.date(),
  z.iso.datetime({
    offset: true,
  }),
]);

export const TransactionCreateSchema = z.object({
  walletId: z
    .uuid({
      error: "Invalid format",
    })
    .nonempty({ error: "Wallet is required" }),
  categoryId: z
    .uuid({
      error: "Invalid format",
    })
    .nonempty({
      error: "Category is required",
    }),
  amount: z.coerce.number(),
  note: z.string().max(200).nullish(),
  transactionAt: z.union([z.date(), z.iso.date(), z.iso.datetime()]),
  isVisibleInReport: z.boolean().default(true),
});

export type TransactionCreate = z.output<typeof TransactionCreateSchema>;

export const TransactionUpdateSchema = TransactionCreateSchema.partial();

export type TransactionUpdateType = Omit<
  z.output<typeof TransactionUpdateSchema>,
  "transactionAt"
> & {
  transactionAt?: Date | undefined;
  imagePath?: string | null;
};

export type TransactionInsert = Omit<TransactionCreate, "transactionAt"> & {
  userId: string;
  transactionAt: Date;
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
  wallet: Omit<WalletResponse, "balance">;
  category: CategoryResponse;
};

export const TransactionRouteParamSchema = z.object({
  id: z.uuid(),
});

const StatisticBalanceOptionsSchema = z.object({
  startDate: z.nullish(z.date()),
  endDate: z.nullish(z.date()),
});
export type StatisticBalanceOptions = z.output<
  typeof StatisticBalanceOptionsSchema
>;

const StatisticBalanceByTypeOptionsSchema = z.object({
  isExpense: z.boolean(),
  startDate: z.nullish(z.date()),
  endDate: z.nullish(z.date()),
});
export type StatisticBalanceByTypeOptions = z.output<
  typeof StatisticBalanceByTypeOptionsSchema
>;

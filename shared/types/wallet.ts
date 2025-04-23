import { z } from "zod";

export const WalletCreateSchema = z.object({
  name: z.string().max(100),
  balance: z.coerce.number().gte(0).default(0),
  icon: z.string().nullish(),
});

export type WalletCreate = z.output<typeof WalletCreateSchema>;

export type WalletResponse = {
  id: string;
  name: string;
  balance: number;
  icon: string | null | undefined;
  created_at: Date | string;
};

export const WalletRouteParamSchema = z.object({
  id: z.uuid(),
});

export const WalletAdjustBalanceCreateSchema = z.object({
  balance: z.coerce.number().gte(0),
});

export type WalletAdjustBalanceCreate = z.output<
  typeof WalletAdjustBalanceCreateSchema
>;

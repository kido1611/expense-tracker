import { z } from "zod/v4";

const WalletIconsSchema = z.literal([
  "i-tabler-wallet",
  "i-tabler-cash",
  "i-tabler-cash-banknote",
  "i-tabler-building-bank",
  "i-tabler-pig-money",
  "i-tabler-moneybag",
  "i-tabler-credit-card",
  "i-tabler-briefcase",
  "i-tabler-shopping-cart",
  "i-tabler-lock",
  "i-tabler-heart",
  "i-tabler-brand-mastercard",
  "i-tabler-brand-visa",
]);
export type WalletIcons = z.output<typeof WalletIconsSchema>;

export const WalletCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  balance: z.coerce.number().gte(0).default(0),
  icon: WalletIconsSchema,
});

export const WalletUpdateSchema = WalletCreateSchema.partial();

export type WalletCreate = z.output<typeof WalletCreateSchema>;

export type WalletUpdate = z.output<typeof WalletUpdateSchema>;

export type WalletResponse = {
  id: string;
  name: string;
  balance: number;
  icon?: string | null;
  created_at: Date | string;
};

export const WalletRouteParamSchema = z.object({
  id: z.uuid({
    error: "Incorrect format",
  }),
});

export const WalletAdjustBalanceCreateSchema = z.object({
  balance: z.coerce.number().gte(0),
});

export type WalletAdjustBalanceCreate = z.output<
  typeof WalletAdjustBalanceCreateSchema
>;

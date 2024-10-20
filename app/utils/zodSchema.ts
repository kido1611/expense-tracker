import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(32),
});

export const walletSchema = z.object({
  name: z.string().max(100),
  balance: z.coerce.number().gte(0).default(0),
  icon: z.string().nullish(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().gte(1).default(1),
  limit: z.coerce.number().gte(1).default(20),
});

export const transactionSchema = z.object({
  walletNanoid: z.string(),
  categoryId: z.coerce.number(),
  amount: z.coerce.number().gte(0),
  note: z.string().max(200).nullish(),
  spendAt: z.string().date(),
  isVisibleInReport: z.boolean().nullish().default(true),
});

export const transactionRouteParamSchema = z.object({
  nanoid: z.string().nanoid(),
});

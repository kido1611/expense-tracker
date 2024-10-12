import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(32),
});

export const walletSchema = z.object({
  name: z.string().max(100),
  balance: z.coerce.number().gte(0).default(0),
});

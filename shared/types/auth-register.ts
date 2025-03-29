import { z } from "zod";

export const authRegisterSchema = z
  .object({
    name: z.string().min(4).max(100),
    email: z.string().email().min(4).max(100),
    password: z.string().min(4).max(32),
    passwordConfirmation: z.string().min(4).max(32),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password does not match",
    path: ["password"],
  });

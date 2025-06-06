import { z } from "zod/v4";

export const UserCreateSchema = z
  .object({
    name: z.string().min(4).max(100),
    email: z.email().min(4).max(100),
    password: z.string().min(4).max(32),
    passwordConfirmation: z.string().min(4).max(32),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password does not match",
    path: ["password"],
  });

export type UserCreate = z.output<typeof UserCreateSchema>;

export const UserLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(4).max(32),
});

export type UserLogin = z.output<typeof UserLoginSchema>;

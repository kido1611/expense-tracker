import { z } from "zod/v4";

export type CategoryResponse = {
  id: string;
  name: string;
  icon: string | null;
  is_expense: boolean;
  created_at: Date | string;
};

export type CategoryStatTransaction = Omit<CategoryResponse, "created_at"> & {
  transactions_count: number;
  transactions_sum_amount: number;
};

export const CategoryCreateSchema = z.object({
  name: z.string().nonempty({ error: "Name is required" }).min(2).max(100),
  // TODO: use literal
  icon: z.string(),
  isExpense: z.boolean(),
});
export type CategoryCreateType = z.output<typeof CategoryCreateSchema>;

export const CategoryUpdateSchema = CategoryCreateSchema.partial();
export type CategoryUpdateType = z.output<typeof CategoryUpdateSchema>;

export const CategoryRouteParamSchema = z.object({
  id: z.uuid({
    error: "Incorrect format",
  }),
});

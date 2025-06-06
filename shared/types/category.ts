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

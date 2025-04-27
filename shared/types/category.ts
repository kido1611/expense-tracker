export type CategoryResponse = {
  id: string;
  name: string;
  icon: string | null;
  is_expense: boolean;
  created_at: Date | string;
};

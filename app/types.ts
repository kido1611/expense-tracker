export type Wallet = {
  nanoid: string;
  name: string;
  balance: number;
  icon: string | null | undefined;
  created_at: string;
};

type TransactionCategory = {
  name: string;
  is_expense: boolean;
};

export type Transaction = {
  nanoid: string;
  amount: number;
  note: string | null | undefined;
  image_path: string | null | undefined;
  spend_at: string;
  is_visible_in_report: boolean;
  created_at: string;
  wallet: Wallet;
  category: TransactionCategory;
};

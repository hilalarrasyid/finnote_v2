export type ExpenseDetail = {
  id: string;
  date: string;
  amount: number;
  description: string | null;
  created_at: string;
  category_id: string | null;
  pocket_id: string | null;
  category_name: string | null;
  pocket_name: string | null;
  category_color: string | null;
  category_icon: string | null;
};

export type PocketSummary = {
  pocketName: string;
  amount: number;
};

export type Pocket = {
  id: string;
  name: string;
  color: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string | null;
};
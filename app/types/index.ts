export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  userId?: string; // Add userId to associate expenses with users
}

export type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  totalExpenses: number;
};

export const CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Housing',
  'Healthcare',
  'Shopping',
  'Education',
  'Travel',
  'Other'
];
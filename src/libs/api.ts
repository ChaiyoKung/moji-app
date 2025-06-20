import { api } from "./axios";

export interface Category {
  _id: string;
  userId: string | null;
  name: string;
  type: "income" | "expense";
  icon?: string;
  color?: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getAllGategoriesByType(type: "income" | "expense") {
  const response = await api.get<Category[]>(`/categories/${type}`);
  return response.data;
}

export interface Account {
  _id: string;
  userId: string;
  name: string;
  type: string;
  balance?: number;
  currency: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAllAccounts() {
  const response = await api.get<Account[]>("/accounts");
  return response.data;
}

export interface CreateTransactionDto {
  userId: string;
  accountId: string;
  categoryId: string;
  type: "income" | "expense";
  amount: number;
  currency: string;
  note?: string;
  date: Date;
}

export interface Transaction {
  _id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  type: "income" | "expense";
  amount: number;
  currency: string;
  note?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function createTransaction(data: CreateTransactionDto) {
  const response = await api.post<Transaction>("/transactions", data);
  return response.data;
}

export type TransactionWithCategory = Transaction & {
  categoryId: Category;
};

export async function getAllTransactions(params: {
  startDate?: string;
  endDate?: string;
}) {
  const response = await api.get<TransactionWithCategory[]>("/transactions", {
    params,
  });
  return response.data;
}

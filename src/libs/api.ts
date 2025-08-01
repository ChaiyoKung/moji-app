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

export interface User {
  _id: string;
  email: string;
  password?: string;
  displayName: string;
  avatarUrl?: string;
  providers: {
    _id: string;
    provider: string;
    providerId: string;
    linkedAt: string;
  }[];
  settings?: {
    currency?: string;
    language?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SignInResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function signInWithGoogle(idToken: string) {
  const response = await api.post<SignInResponse>("/auth/google", {
    idToken,
  });
  return response.data;
}

export async function logout(refreshToken: string) {
  const response = await api.post("/auth/logout", { refreshToken });
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
  date: string;
  timezone: string;
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
  timezone?: string;
}) {
  const response = await api.get<TransactionWithCategory[]>("/transactions", {
    params,
  });
  return response.data;
}

export interface Summary {
  type: "income" | "expense";
  date: string;
  total: number;
  count: number;
}

export async function getSummary(params: {
  type: "income" | "expense";
  date: string;
  timezone: string;
}) {
  const response = await api.get<Summary>("/analytics/summary", { params });
  return response.data;
}

export interface TransactionIdsByDate {
  _id: string; // date string
  ids: string[];
}

export async function getTransactionIdsByDate(params: {
  startDate: string;
  endDate: string;
  timezone: string;
}) {
  const response = await api.get<TransactionIdsByDate[]>(
    "/transactions/ids-by-date",
    { params }
  );
  return response.data;
}

export interface CreateAccountDto {
  userId: string;
  name: string;
  type: string;
  balance?: number;
  currency: string;
  icon?: string;
}

export async function createAccount(data: CreateAccountDto) {
  const response = await api.post<Account>("/accounts", data);
  return response.data;
}

export async function deleteTransaction(id: string) {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
}

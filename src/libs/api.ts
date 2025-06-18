import { api } from "./axios";

interface Category {
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

export const getAllGategoriesByType = async (type: "income" | "expense") => {
  const response = await api.get<Category[]>(`/categories/${type}`);
  return response.data;
};

interface Account {
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

export const getAllAccounts = async () => {
  const response = await api.get<Account[]>("/accounts");
  return response.data;
};

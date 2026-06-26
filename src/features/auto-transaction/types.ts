import type { Category } from "../../libs/api";

export type { Category };

export interface DraftTransaction {
  _id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  type: "income" | "expense";
  amount?: number;
  currency: string;
  note?: string;
  date: string;
  status: "draft";
  aiModel: string;
  createdAt: string;
  updatedAt: string;
}

export interface FailedItem {
  item: number;
  reason: string;
}

export interface UserMessage {
  id: string;
  role: "user";
  text?: string;
  imageUri?: string;
  timestamp: number;
}

export interface LoadingMessage {
  id: string;
  role: "loading";
  timestamp: number;
}

export interface ResultMessage {
  id: string;
  role: "result";
  created: DraftTransaction[];
  failed: FailedItem[];
  timestamp: number;
}

export interface ErrorMessage {
  id: string;
  role: "error";
  message: string;
  timestamp: number;
}

export type ChatMessage =
  | UserMessage
  | LoadingMessage
  | ResultMessage
  | ErrorMessage;

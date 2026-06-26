import type { Category, Transaction, FailedItem } from "../../libs/api";

export type { Category, Transaction, FailedItem };

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
  created: Transaction[];
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

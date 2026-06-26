import type { Category, DraftTransaction, FailedItem } from "../../libs/api";

export type { Category, DraftTransaction, FailedItem };

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

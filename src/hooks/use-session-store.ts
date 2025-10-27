import { useStore } from "zustand";
import { SessionState, sessionStore } from "../stores/session-store";

export function useSessionStore(): SessionState;
export function useSessionStore<T>(selector: (state: SessionState) => T): T;
export function useSessionStore<T>(selector?: (state: SessionState) => T) {
  return useStore(sessionStore, selector!);
}

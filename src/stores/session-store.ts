import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { SecureStorage } from "../libs/secure-storage";

export interface SessionState {
  userId?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  signIn: (userId: string, accessToken: string, refreshToken: string) => void;
  signOut: () => void;
}

export const sessionStore = createStore<SessionState>()(
  persist(
    (set) => ({
      userId: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,
      setIsLoading: (isLoading) => set({ isLoading }),
      signIn: (userId: string, accessToken: string, refreshToken: string) => {
        set({ userId, accessToken, refreshToken });
      },
      signOut: () => {
        set({ userId: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: "session",
      storage: createJSONStorage(() => SecureStorage),
      onRehydrateStorage: (state) => {
        return () => state.setIsLoading(false);
      },
    }
  )
);

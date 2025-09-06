import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface HideBalanceStore {
  isBalanceHidden: boolean;
  isLoading: boolean;
  toggleHideBalance: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useHideBalanceStore = create<HideBalanceStore>()(
  persist(
    (set, get) => ({
      isBalanceHidden: true,
      isLoading: true,
      toggleHideBalance: () => set({ isBalanceHidden: !get().isBalanceHidden }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "hideBalance",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        return () => state.setIsLoading(false);
      },
    }
  )
);

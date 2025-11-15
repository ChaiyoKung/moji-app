import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingState {
  isAutoFocusAmount: boolean;
  toggleAutoFocusAmount: () => void;

  isAutoFocusNote: boolean;
  toggleAutoFocusNote: () => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set, get) => ({
      isAutoFocusAmount: false,
      toggleAutoFocusAmount: () => {
        set({ isAutoFocusAmount: !get().isAutoFocusAmount });
      },

      isAutoFocusNote: false,
      toggleAutoFocusNote: () => {
        set({ isAutoFocusNote: !get().isAutoFocusNote });
      },
    }),
    {
      name: "setting",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

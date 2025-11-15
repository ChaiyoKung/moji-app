import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingState {
  isBalanceHidden: boolean;
  toggleHideBalance: () => void;

  isCalendarSwipeMonthsEnabled: boolean;
  toggleCalendarSwipeMonthsEnabled: () => void;

  isAutoFocusAmount: boolean;
  toggleAutoFocusAmount: () => void;

  isAutoFocusNote: boolean;
  toggleAutoFocusNote: () => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set, get) => ({
      isBalanceHidden: false,
      toggleHideBalance: () => {
        set({ isBalanceHidden: !get().isBalanceHidden });
      },

      isCalendarSwipeMonthsEnabled: false,
      toggleCalendarSwipeMonthsEnabled: () => {
        set({
          isCalendarSwipeMonthsEnabled: !get().isCalendarSwipeMonthsEnabled,
        });
      },

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

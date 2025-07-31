import { use, createContext, type PropsWithChildren } from "react";
import { useAsyncStorageState } from "../hooks/use-async-storage-state";

const HideBalanceContext = createContext<{
  toggleHideBalance: () => void;
  hideBalance?: string | null;
  isBalanceHidden: boolean;
  isLoading: boolean;
}>({
  toggleHideBalance: () => {},
  hideBalance: null,
  isBalanceHidden: false,
  isLoading: false,
});

export function useHideBalance() {
  const value = use(HideBalanceContext);
  if (!value) {
    throw new Error(
      "useHideBalance must be wrapped in a <HideBalanceProvider />"
    );
  }
  return value;
}

export function HideBalanceProvider({ children }: PropsWithChildren) {
  const [[isLoading, hideBalance], setHideBalance] =
    useAsyncStorageState("hideBalance");
  const isBalanceHidden = hideBalance === "true";

  const toggleHideBalance = () => {
    setHideBalance(isBalanceHidden ? "false" : "true");
  };

  return (
    <HideBalanceContext
      value={{
        toggleHideBalance,
        hideBalance,
        isBalanceHidden,
        isLoading,
      }}
    >
      {children}
    </HideBalanceContext>
  );
}

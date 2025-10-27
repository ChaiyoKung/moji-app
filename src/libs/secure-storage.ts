import { StateStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

export const SecureStorage: StateStorage = {
  getItem(name: string) {
    return SecureStore.getItemAsync(name);
  },
  setItem(name: string, value: string) {
    return SecureStore.setItemAsync(name, value);
  },
  removeItem(name: string) {
    return SecureStore.deleteItemAsync(name);
  },
};

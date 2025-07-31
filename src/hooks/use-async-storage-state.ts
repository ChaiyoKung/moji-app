import { useEffect, useCallback, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setAsyncStorageItem(key: string, value: string | null) {
  if (value === null) {
    await AsyncStorage.removeItem(key);
  } else {
    await AsyncStorage.setItem(key, value);
  }
}

export async function getAsyncStorageItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error("AsyncStorage is unavailable:", e);
    return null;
  }
}

export function useAsyncStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    const loadAsync = async () => {
      const value = await getAsyncStorageItem(key);
      setState(value);
    };

    loadAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setAsyncStorageItem(key, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [state, setValue];
}

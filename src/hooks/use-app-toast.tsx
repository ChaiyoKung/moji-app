import React from "react";
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "../components/ui/toast";
import { randomUUID } from "expo-crypto";
import { SafeAreaView } from "react-native-safe-area-context";

export type ToastType = "success" | "error" | "warning" | "info" | "muted";

export interface ShowToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export function useAppToast() {
  const toast = useToast();

  const showToast = (type: ToastType, options: ShowToastOptions) => {
    const newId = randomUUID();

    const defaultDuration =
      type === "error" ? 4000 : type === "warning" ? 3500 : 3000;

    toast.show({
      id: newId,
      placement: "top",
      duration: options.duration ?? defaultDuration,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <SafeAreaView edges={["top"]}>
            <Toast nativeID={uniqueToastId} action={type} variant="outline">
              <ToastTitle>{options.title}</ToastTitle>
              {options.description ? (
                <ToastDescription>{options.description}</ToastDescription>
              ) : null}
            </Toast>
          </SafeAreaView>
        );
      },
    });
  };

  return {
    success: (title: string, description?: string, duration?: number) => {
      showToast("success", { title, description, duration });
    },

    error: (title: string, description?: string, duration?: number) => {
      showToast("error", { title, description, duration });
    },

    warning: (title: string, description?: string, duration?: number) => {
      showToast("warning", { title, description, duration });
    },
  };
}

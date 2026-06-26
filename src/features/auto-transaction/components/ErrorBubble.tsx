import React from "react";
import { View } from "react-native";
import { Text } from "../../../components/ui/text";

interface ErrorBubbleProps {
  message: string;
}

export function ErrorBubble({ message }: ErrorBubbleProps) {
  return (
    <View className="mb-2 self-start">
      <View className="rounded-2xl rounded-tl-sm border border-error-200 bg-background-error px-4 py-3">
        <Text size="sm" className="text-error-600">
          {message}
        </Text>
      </View>
    </View>
  );
}

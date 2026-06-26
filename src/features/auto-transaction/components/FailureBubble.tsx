import React from "react";
import { View } from "react-native";
import { Text } from "../../../components/ui/text";
import type { FailedItem } from "../types";

interface FailureBubbleProps {
  item: FailedItem;
}

export function FailureBubble({ item }: FailureBubbleProps) {
  return (
    <View className="mb-1 self-start">
      <View className="rounded-2xl rounded-tl-sm border border-warning-200 bg-background-warning px-4 py-2">
        <Text size="sm" className="text-warning-600">
          {`Item ${item.item}: ${item.reason}`}
        </Text>
      </View>
    </View>
  );
}

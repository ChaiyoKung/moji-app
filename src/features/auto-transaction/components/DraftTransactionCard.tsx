import React from "react";
import { View } from "react-native";
import dayjs from "dayjs";
import { Pressable } from "../../../components/ui/pressable";
import { HStack } from "../../../components/ui/hstack";
import { VStack } from "../../../components/ui/vstack";
import { Text } from "../../../components/ui/text";
import { Badge, BadgeText } from "../../../components/ui/badge";
import type { DraftTransaction, Category } from "../types";
import { formatBaht } from "../../../utils/format-baht";

interface DraftTransactionCardProps {
  transaction: DraftTransaction;
  category: Category | undefined;
  onPress: (id: string) => void;
}

export function DraftTransactionCard({
  transaction,
  category,
  onPress,
}: DraftTransactionCardProps) {
  const isIncome = transaction.type === "income";

  const amountDisplay =
    transaction.amount !== undefined
      ? `${transaction.currency === "THB" ? "฿" : transaction.currency}${formatBaht(transaction.amount)}`
      : "—";

  const categoryDisplay = category
    ? `${category.icon ?? ""} ${category.name}`.trim()
    : "Unknown";

  const dateDisplay = dayjs(transaction.date).format("YYYY-MM-DD");

  return (
    <Pressable
      onPress={() => onPress(transaction._id)}
      className="mb-2 w-full max-w-xs self-start"
    >
      <View className="rounded-2xl border border-outline-200 bg-background-0 p-4 shadow-soft-1">
        <HStack className="mb-2 items-start justify-between">
          <Badge action={isIncome ? "success" : "error"} variant="solid">
            <BadgeText>{isIncome ? "Income" : "Expense"}</BadgeText>
          </Badge>
          <Badge action="warning" variant="outline">
            <BadgeText>Draft</BadgeText>
          </Badge>
        </HStack>

        <VStack space="xs">
          <Text
            size="2xl"
            bold
            className={isIncome ? "text-success-500" : "text-error-500"}
          >
            {amountDisplay}
          </Text>

          <HStack space="xs" className="items-center">
            <Text size="sm" className="text-typography-500">
              Category:
            </Text>
            <Text size="sm">{categoryDisplay}</Text>
          </HStack>

          <HStack space="xs" className="items-center">
            <Text size="sm" className="text-typography-500">
              Date:
            </Text>
            <Text size="sm">{dateDisplay}</Text>
          </HStack>

          {transaction.note ? (
            <HStack space="xs" className="items-center">
              <Text size="sm" className="text-typography-500">
                Note:
              </Text>
              <Text size="sm" numberOfLines={2}>
                {transaction.note}
              </Text>
            </HStack>
          ) : null}
        </VStack>
      </View>
    </Pressable>
  );
}

import React, { useState } from "react";
import { HStack } from "../ui/hstack";
import { Center } from "../ui/center";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { Pressable } from "../ui/pressable";
import { AmountText } from "../amount-text";
import { TransactionWithCategory } from "../../libs/api";

export interface TransactionItemProps {
  data: TransactionWithCategory;
}

export function TransactionItem({ data }: TransactionItemProps) {
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);

  const handlePress = () => {
    if (data.note) {
      setIsNoteExpanded((prev) => !prev);
    }
  };

  return (
    <Pressable onPress={handlePress} testID="transaction-pressable">
      <HStack
        key={data._id}
        space="md"
        className="bg-white p-4 rounded-2xl border border-gray-200 items-center"
      >
        <Center
          className="rounded-full w-12 h-12"
          style={{ backgroundColor: data.categoryId.color }}
        >
          <Text size="2xl">{data.categoryId.icon}</Text>
        </Center>
        <VStack className="flex-1">
          <Text size="lg" className="text-typography-black">
            {data.categoryId.name}
          </Text>
          {data.note ? (
            <Text 
              size="sm" 
              className="text-typography-500" 
              numberOfLines={isNoteExpanded ? undefined : 1}
              testID="transaction-note"
            >
              {data.note}
            </Text>
          ) : null}
        </VStack>
        <AmountText
          size="4xl"
          bold
          type={data.type}
          value={data.amount}
          showSign
        />
      </HStack>
    </Pressable>
  );
}

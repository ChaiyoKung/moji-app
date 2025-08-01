import { HStack } from "../ui/hstack";
import { Center } from "../ui/center";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { AmountText } from "../amount-text";
import { TransactionWithCategory } from "../../libs/api";

export interface TransactionItemProps {
  data: TransactionWithCategory;
}

export function TransactionItem({ data }: TransactionItemProps) {
  return (
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
          <Text size="sm" className="text-typography-500" numberOfLines={1}>
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
  );
}

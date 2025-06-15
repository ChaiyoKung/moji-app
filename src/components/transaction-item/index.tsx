import { HStack } from "../ui/hstack";
import { Center } from "../ui/center";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { AmountText } from "../amount-text";

export interface Category {
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  _id: string;
  type: "expense" | "income";
  amount: number;
  currency: string;
  note?: string;
  date: Date;
  category: Category;
}

export interface TransactionItemProps {
  data: Transaction;
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
        style={{ backgroundColor: data.category.color }}
      >
        <Text size="2xl">{data.category.icon}</Text>
      </Center>
      <VStack className="flex-1">
        <Text size="lg" className="text-typography-black">
          {data.category.name}
        </Text>
        <Text size="sm" className="text-typography-500">
          {data.note || "-"}
        </Text>
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

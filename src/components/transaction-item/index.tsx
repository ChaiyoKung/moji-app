import { Pressable } from "../ui/pressable";
import { HStack } from "../ui/hstack";
import { Center } from "../ui/center";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { AmountText } from "../amount-text";
import { TransactionWithCategory } from "../../libs/api";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Icon } from "../ui/icon";

export interface TransactionItemProps {
  data: TransactionWithCategory;
}

export function TransactionItem({ data }: TransactionItemProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/transactions/[id]",
      params: { id: data._id },
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <HStack
        key={data._id}
        space="md"
        className="items-center rounded-2xl border border-outline-200 bg-background-0 p-4"
      >
        <Center
          className="h-12 w-12 rounded-full"
          style={{ backgroundColor: data.categoryId.color }}
        >
          <Text size="2xl">{data.categoryId.icon}</Text>
        </Center>
        <VStack className="flex-1">
          <Text size="lg">{data.categoryId.name}</Text>
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
        <Icon as={ChevronRight} size="xs" className="text-typography-500" />
      </HStack>
    </Pressable>
  );
}

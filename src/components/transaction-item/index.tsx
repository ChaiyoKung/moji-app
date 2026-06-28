import { Pressable } from "../ui/pressable";
import { HStack } from "../ui/hstack";
import { Center } from "../ui/center";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { AmountText } from "../amount-text";
import { TransactionWithCategory } from "../../libs/api";
import { useRouter } from "expo-router";
import { ChevronRight, Sparkles } from "lucide-react-native";
import { Icon } from "../ui/icon";
import { Badge, BadgeIcon, BadgeText } from "../ui/badge";
import dayjs from "dayjs";
import { tva } from "@gluestack-ui/utils/nativewind-utils";

const containerStyle = tva({
  base: "items-center rounded-2xl border border-outline-200 bg-background-0 p-4",
  variants: {
    status: {
      confirmed: "",
      draft: "border-warning-200",
    },
  },
});

export interface TransactionItemProps {
  data: TransactionWithCategory;
  showDate?: boolean;
}

export function TransactionItem({ data, showDate }: TransactionItemProps) {
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
        className={containerStyle({ status: data.status })}
      >
        <Center
          className="h-12 w-12 rounded-full"
          style={{ backgroundColor: data.categoryId.color }}
        >
          <Text size="2xl">{data.categoryId.icon}</Text>
        </Center>
        <VStack className="flex-1">
          <HStack space="xs" className="mb-1 items-center">
            {data.status === "draft" && (
              <Badge
                variant="outline"
                action="warning"
                size="sm"
                className="self-start"
              >
                <BadgeText>Draft</BadgeText>
              </Badge>
            )}
            {data.aiModel ? (
              <Badge
                variant="outline"
                action="info"
                size="sm"
                className="self-start"
              >
                <BadgeIcon as={Sparkles} />
                <BadgeText>AI Generated</BadgeText>
              </Badge>
            ) : null}
          </HStack>
          {showDate ? (
            <Text size="sm" className="text-typography-400">
              {dayjs(data.date).format("YYYY-MM-DD")}
            </Text>
          ) : null}
          <Text size="lg">{data.categoryId.name}</Text>
          {data.note ? (
            <Text size="sm" className="text-typography-500" numberOfLines={1}>
              {data.note}
            </Text>
          ) : null}
        </VStack>
        {data.amount !== undefined && (
          <AmountText
            size="4xl"
            bold
            type={data.type}
            value={data.amount}
            showSign
          />
        )}
        <Icon as={ChevronRight} size="xs" className="text-typography-500" />
      </HStack>
    </Pressable>
  );
}

import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { AmountText } from "../amount-text";
import { Spinner } from "../ui/spinner";
import { Pressable } from "../ui/pressable";
import { Eye, EyeOff } from "lucide-react-native";
import { Icon } from "../ui/icon";
import { useAsyncStorageState } from "../../hooks/use-async-storage-state";

export interface BalanceSummaryProps {
  label: string;
  value?: number | null;
  isLoading?: boolean;
  error?: Error | null;
}

export function BalanceSummary({
  label,
  value,
  isLoading,
  error,
}: BalanceSummaryProps) {
  const [[loading, hideBalance], setHideBalance] =
    useAsyncStorageState("hideBalance");
  const isBalanceHidden = hideBalance === "true";

  let content;
  if (isLoading || loading) {
    content = <Spinner />;
  } else if (error) {
    content = <Text className="text-red-500">เกิดข้อผิดพลาด</Text>;
  } else if (value === null || value === undefined) {
    content = <Text className="text-gray-500">ไม่พบข้อมูล</Text>;
  } else {
    content = (
      <AmountText
        type="income"
        value={value}
        size="xl"
        bold
        hideValue={isBalanceHidden}
      />
    );
  }

  return (
    <VStack className="items-start">
      <Text className="text-typography-500">{label}</Text>
      <Pressable
        className="flex-row items-center gap-1"
        onPress={() => setHideBalance(isBalanceHidden ? "false" : "true")}
      >
        {content}
        {isBalanceHidden ? (
          <Icon as={EyeOff} size="sm" className="text-typography-300" />
        ) : (
          <Icon as={Eye} size="sm" className="text-typography-300" />
        )}
      </Pressable>
    </VStack>
  );
}

import { VStack } from "../../components/ui/vstack";
import { Text } from "../../components/ui/text";
import { AmountText } from "../../components/amount-text";
import { Spinner } from "../../components/ui/spinner";
import { Pressable } from "../../components/ui/pressable";
import { Eye, EyeOff } from "lucide-react-native";
import { Icon } from "../../components/ui/icon";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "../../libs/api";
import { useHideBalanceStore } from "../../stores/use-hide-balance-store";

export function AccountBalanceSummary() {
  const loadingHide = useHideBalanceStore((state) => state.isLoading);
  const isBalanceHidden = useHideBalanceStore((state) => state.isBalanceHidden);
  const toggleHideBalance = useHideBalanceStore(
    (state) => state.toggleHideBalance
  );

  const accountQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
  });

  const value = accountQuery.data?.[0]?.balance;
  const isLoading = accountQuery.isLoading || loadingHide;
  const error = accountQuery.error;

  let content;
  if (isLoading) {
    content = <Spinner />;
  } else if (error) {
    content = <Text className="text-error-500">เกิดข้อผิดพลาด</Text>;
  } else if (value === null || value === undefined) {
    content = <Text className="text-typography-500">ไม่พบข้อมูล</Text>;
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
      <Text className="text-typography-500">เงินคงเหลือ</Text>
      <Pressable
        className="flex-row items-center gap-1"
        onPress={toggleHideBalance}
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

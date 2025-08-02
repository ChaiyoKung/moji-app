import { Pressable } from "../../components/ui/pressable";
import { Icon } from "../../components/ui/icon";
import { Eye, EyeOff } from "lucide-react-native";
import { Spinner } from "../../components/ui/spinner";
import { Text } from "../../components/ui/text";
import { useHideBalance } from "../../components/hide-balance-context";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "../../libs/api";
import { formatBaht } from "../../utils/format-baht";

export function AccountBalanceToggle() {
  const accountQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
  });
  const { isLoading, isBalanceHidden, toggleHideBalance } = useHideBalance();

  return (
    <Pressable
      className="flex-row items-center gap-1"
      onPress={toggleHideBalance}
    >
      {accountQuery.isLoading || isLoading ? (
        <Spinner />
      ) : accountQuery.error ? (
        <Text className="text-red-500">เกิดข้อผิดพลาดในการโหลดยอดเงิน</Text>
      ) : accountQuery.data?.[0]?.balance === undefined ? (
        <Text className="text-gray-500">ไม่มีบัญชี</Text>
      ) : (
        <Text className="text-teal-500">
          {isBalanceHidden
            ? "******"
            : formatBaht(accountQuery.data[0].balance)}
        </Text>
      )}
      {isBalanceHidden ? (
        <Icon as={EyeOff} size="sm" className="text-typography-300" />
      ) : (
        <Icon as={Eye} size="sm" className="text-typography-300" />
      )}
    </Pressable>
  );
}

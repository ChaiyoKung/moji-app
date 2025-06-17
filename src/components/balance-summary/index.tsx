import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { AmountText } from "../amount-text";
import { Spinner } from "../ui/spinner";

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
  let content;
  if (isLoading) {
    content = <Spinner />;
  } else if (error) {
    content = <Text className="text-red-500">เกิดข้อผิดพลาด</Text>;
  } else if (value === null || value === undefined) {
    content = <Text className="text-gray-500">ไม่พบข้อมูล</Text>;
  } else {
    content = <AmountText type="income" value={value} size="2xl" bold />;
  }

  return (
    <VStack className="items-start">
      <Text className="text-typography-500">{label}</Text>
      {content}
    </VStack>
  );
}

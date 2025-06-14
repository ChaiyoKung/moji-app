import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { formatBaht } from "../../utils/format-baht";

export interface BalanceSummaryProps {
  label: string;
  value: number;
}

export function BalanceSummary({ label, value }: BalanceSummaryProps) {
  return (
    <VStack>
      <Text className="text-typography-500">{label}</Text>
      <Text size="2xl" bold className="text-green-500">
        {formatBaht(value)}
      </Text>
    </VStack>
  );
}

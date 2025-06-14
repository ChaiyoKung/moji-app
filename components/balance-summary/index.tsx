import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { AmountText } from "../amount-text";

export interface BalanceSummaryProps {
  label: string;
  value: number;
}

export function BalanceSummary({ label, value }: BalanceSummaryProps) {
  return (
    <VStack>
      <Text className="text-typography-500">{label}</Text>
      <AmountText type="income" value={value} size="2xl" bold />
    </VStack>
  );
}

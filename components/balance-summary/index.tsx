import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { Heading } from "../ui/heading";

export interface BalanceSummaryProps {
  label: string;
  value: number;
}

export function BalanceSummary({ label, value }: BalanceSummaryProps) {
  return (
    <VStack>
      <Text className="text-gray-500">{label}</Text>
      <Heading size="xl" className="text-green-500">
        {value.toLocaleString("th-TH")}
      </Heading>
    </VStack>
  );
}

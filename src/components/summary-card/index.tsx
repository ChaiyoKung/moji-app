import { formatBaht } from "../../utils/format-baht";
import { Box } from "../ui/box";
import { Center } from "../ui/center";
import { Text } from "../ui/text";

export interface SummaryCardProps {
  label: string;
  value: number;
}

export function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <Box className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <Center className="px-4 py-2 border-b border-gray-200 bg-red-100">
        <Text bold className="text-red-800">
          {label}
        </Text>
      </Center>
      <Center className="p-4">
        <Text size="4xl" bold className="text-typography-black">
          {formatBaht(value)}
        </Text>
      </Center>
    </Box>
  );
}

import { ReactNode } from "react";
import { formatBaht } from "../../utils/format-baht";
import { Box } from "../ui/box";
import { Center } from "../ui/center";
import { Text } from "../ui/text";

export interface SummaryCardProps {
  label: string;
  children?: ReactNode;
}

export function SummaryCard({ label, children }: SummaryCardProps) {
  return (
    <Box className="overflow-hidden rounded-2xl border border-outline-200 bg-background-0">
      <Center className="border-b border-outline-200 bg-error-100 px-4 py-2">
        <Text bold className="text-error-800">
          {label}
        </Text>
      </Center>
      <Center className="p-4">{children}</Center>
    </Box>
  );
}

export interface SummaryCardTextProps {
  value: number;
}

export function SummaryCardValue({ value }: SummaryCardTextProps) {
  return (
    <Text size="4xl" bold>
      {formatBaht(value)}
    </Text>
  );
}

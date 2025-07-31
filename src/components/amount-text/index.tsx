import { Text } from "../ui/text";
import { formatBaht } from "../../utils/format-baht";

export interface AmountTextProps {
  value: number;
  type?: "expense" | "income";
  size?:
    | "2xs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl";
  bold?: boolean;
  showSign?: boolean;
  hideValue?: boolean;
}

export function AmountText({
  value,
  type = "income",
  size = "md",
  bold,
  showSign,
  hideValue,
}: AmountTextProps) {
  const sign = showSign ? (type === "income" ? "+" : "-") : "";
  const color = type === "income" ? "text-green-500" : "text-red-500";
  const formattedValue = hideValue ? "******" : formatBaht(value);
  const displayValue = sign + formattedValue;

  return (
    <Text size={size} bold={bold} className={color}>
      {displayValue}
    </Text>
  );
}

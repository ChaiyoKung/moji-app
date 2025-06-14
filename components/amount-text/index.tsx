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
}

export function AmountText({
  value,
  type = "income",
  size = "md",
  bold,
  showSign,
}: AmountTextProps) {
  const sign = showSign ? (type === "income" ? "+" : "-") : "";
  const color = type === "income" ? "text-green-500" : "text-red-500";
  const displayValue = sign + formatBaht(value);

  return (
    <Text size={size} bold={bold} className={color}>
      {displayValue}
    </Text>
  );
}

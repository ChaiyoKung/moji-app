import { useColorScheme } from "nativewind";

const LIGHT = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#6250d6",
];
const DARK = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#9085e9"];

export function useChartColors() {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? DARK : LIGHT;
}

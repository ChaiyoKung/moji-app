import { useColorScheme } from "nativewind";

// Same values as --color-primary-500 in gluestack-ui-provider/custom-config.ts
const LIGHT = "rgb(43, 127, 255)";
const DARK = "rgb(81, 162, 255)";

export function usePrimaryColor() {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? DARK : LIGHT;
}

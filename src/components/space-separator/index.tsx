import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { Box } from "../ui/box";

const spaceSeparatorStyle = tva({
  base: "",
  variants: {
    gap: {
      xs: "h-1",
      sm: "h-2",
      md: "h-4",
      lg: "h-6",
      xl: "h-8",
      "2xl": "h-10",
    },
  },
});

export interface SpaceSeparatorProps {
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export function SpaceSeparator({ gap = "md" }: SpaceSeparatorProps) {
  return <Box className={spaceSeparatorStyle({ gap })} />;
}

import { Box } from "../ui/box";

type SpaceSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const sizeClass: Record<SpaceSize, string> = {
  xs: "h-1",
  sm: "h-2",
  md: "h-4",
  lg: "h-6",
  xl: "h-8",
  "2xl": "h-10",
};

export interface SpaceSeparatorProps {
  gap?: SpaceSize;
}

export function SpaceSeparator({ gap = "md" }: SpaceSeparatorProps) {
  return <Box className={sizeClass[gap]} />;
}

import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";

const baseStyle = isWeb
  ? "font-sans tracking-sm my-0 bg-transparent border-0 box-border display-inline list-none margin-0 padding-0 position-relative text-start no-underline whitespace-pre-wrap word-wrap-break-word"
  : "";

export const textStyle = tva({
  base: `font-body text-typography-900 ${baseStyle}`,

  variants: {
    isTruncated: {
      true: "web:truncate",
    },
    bold: {
      true: "font-bold",
    },
    underline: {
      true: "underline",
    },
    strikeThrough: {
      true: "line-through",
    },
    size: {
      "2xs": "text-2xs leading-normal",
      xs: "text-xs leading-normal",
      sm: "text-sm leading-normal",
      md: "text-base leading-normal",
      lg: "text-lg leading-normal",
      xl: "text-xl leading-normal",
      "2xl": "text-2xl leading-normal",
      "3xl": "text-3xl leading-normal",
      "4xl": "text-4xl leading-normal",
      "5xl": "text-5xl leading-normal",
      "6xl": "text-6xl leading-normal",
    },
    sub: {
      true: "text-xs",
    },
    italic: {
      true: "italic",
    },
    highlight: {
      true: "bg-yellow-500",
    },
  },
});

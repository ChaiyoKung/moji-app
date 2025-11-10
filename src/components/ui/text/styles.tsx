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
      "2xs": "text-2xs",
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      // HACK: Adjust padding to fix rendering issues for Thai vowels, tone marks, garun, and complex consonants in mobile apps
      "2xl": "ios:pt-0.5 android:pt-0.5 text-2xl",
      "3xl": "ios:pt-1.5 android:pt-1 text-3xl",
      "4xl": "ios:pt-2.5 android:pt-1.5 text-4xl",
      "5xl": "ios:pt-5 android:pt-2 text-5xl",
      "6xl": "ios:pt-6 android:pt-2.5 text-6xl",
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

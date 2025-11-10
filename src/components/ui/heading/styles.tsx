import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
const baseStyle = isWeb
  ? "font-sans tracking-sm bg-transparent border-0 box-border display-inline list-none margin-0 padding-0 position-relative text-start no-underline whitespace-pre-wrap word-wrap-break-word"
  : "";

export const headingStyle = tva({
  base: `tracking-sm my-0 font-heading font-bold text-typography-900 ${baseStyle}`,
  variants: {
    isTruncated: {
      true: "truncate",
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
    sub: {
      true: "text-xs",
    },
    italic: {
      true: "italic",
    },
    highlight: {
      true: "bg-yellow-500",
    },
    size: {
      // HACK: Adjust padding to fix rendering issues for Thai vowels, tone marks, garun, and complex consonants in mobile apps
      "5xl": "ios:pt-6 android:pt-2.5 text-6xl",
      "4xl": "ios:pt-5 android:pt-2 text-5xl",
      "3xl": "ios:pt-2.5 android:pt-1.5 text-4xl",
      "2xl": "ios:pt-1.5 android:pt-1 text-3xl",
      xl: "ios:pt-0.5 android:pt-0.5 text-2xl",
      lg: "text-xl",
      md: "text-lg",
      sm: "text-base",
      xs: "text-sm",
    },
  },
});

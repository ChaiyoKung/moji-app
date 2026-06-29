import React from "react";
import { View } from "react-native";
import {
  tva,
  withStyleContext,
  useStyleContext,
} from "@gluestack-ui/utils/nativewind-utils";
import { Text } from "../ui/text";
import { Spinner } from "../ui/spinner";

const SCOPE = "CHAT_BUBBLE";
const Root = withStyleContext(View, SCOPE);

const chatBubbleStyle = tva({
  base: "rounded-2xl px-4 py-3",
  variants: {
    align: {
      left: "self-start rounded-tl-sm",
      right: "self-end rounded-tr-sm",
    },
    color: {
      primary: "",
      error: "",
      warn: "",
      default: "",
    },
    variant: {
      solid: "",
      outline: "",
    },
  },
  compoundVariants: [
    {
      color: "primary",
      variant: "solid",
      class: "bg-primary-500",
    },
    {
      color: "default",
      variant: "solid",
      class: "border border-outline-200 bg-background-100",
    },
    {
      color: "error",
      variant: "outline",
      class: "border border-error-200 bg-background-error",
    },
    {
      color: "warn",
      variant: "outline",
      class: "border border-warning-200 bg-background-warning",
    },
    {
      color: "primary",
      variant: "outline",
      class: "border border-primary-200 bg-background-50",
    },
    {
      color: "error",
      variant: "solid",
      class: "bg-error-500",
    },
    {
      color: "warn",
      variant: "solid",
      class: "bg-warning-500",
    },
    {
      color: "default",
      variant: "outline",
      class: "border border-outline-200 bg-background-50",
    },
  ],
  defaultVariants: {
    align: "left",
    color: "primary",
    variant: "solid",
  },
});

const chatBubbleTextStyle = tva({
  base: "",
  parentVariants: {
    color: {
      primary: "text-typography-0",
      error: "text-error-600",
      warn: "text-warning-600",
      default: "text-typography-600",
    },
    variant: {
      solid: "",
      outline: "",
    },
  },
});

export interface ChatBubbleProps {
  align?: "left" | "right";
  color?: "primary" | "error" | "warn" | "default";
  variant?: "solid" | "outline";
  className?: string;
  children: React.ReactNode;
}

export interface ChatBubbleTextProps {
  color?: "primary" | "error" | "warn" | "default";
  variant?: "solid" | "outline";
  children: string;
}

export function ChatBubbleText({
  color,
  variant,
  children,
}: ChatBubbleTextProps) {
  const { color: parentColor, variant: parentVariant } = useStyleContext(SCOPE);

  return (
    <Text
      className={chatBubbleTextStyle({
        parentVariants: {
          color: parentColor,
          variant: parentVariant,
        },
        ...(color !== undefined && { color }),
        ...(variant !== undefined && { variant }),
      })}
    >
      {children}
    </Text>
  );
}

const chatBubbleSpinnerStyle = tva({
  base: "",
  parentVariants: {
    color: {
      primary: "text-typography-0",
      error: "text-error-600",
      warn: "text-warning-600",
      default: "text-typography-600",
    },
  },
});

export interface ChatBubbleSpinnerProps {
  size?: React.ComponentProps<typeof Spinner>["size"];
}

export function ChatBubbleSpinner({ size }: ChatBubbleSpinnerProps) {
  const { color: parentColor } = useStyleContext(SCOPE);

  return (
    <Spinner
      size={size}
      className={chatBubbleSpinnerStyle({
        parentVariants: { color: parentColor },
      })}
    />
  );
}

export function ChatBubble({
  align = "left",
  color = "primary",
  variant = "solid",
  className,
  children,
}: ChatBubbleProps) {
  return (
    <Root
      className={chatBubbleStyle({ align, color, variant, class: className })}
      context={{ color, variant }}
    >
      {children}
    </Root>
  );
}

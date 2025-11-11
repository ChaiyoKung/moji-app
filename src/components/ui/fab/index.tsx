"use client";
import React from "react";
import { createFab } from "@gluestack-ui/fab";
import { Pressable, Text } from "react-native";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
  withStyleContext,
  useStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import { cssInterop } from "nativewind";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { PrimitiveIcon, UIIcon } from "@gluestack-ui/icon";

const SCOPE = "FAB";
const Root = withStyleContext(Pressable, SCOPE);
const UIFab = createFab({
  Root: Root,
  Label: Text,
  Icon: UIIcon,
});

cssInterop(PrimitiveIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: "classNameColor",
      stroke: true,
    },
  },
});

const fabStyle = tva({
  base: "group/fab disabled:pointer-events-all absolute z-20 flex-row items-center justify-center rounded-full p-4 shadow-hard-2 disabled:cursor-not-allowed disabled:opacity-40 data-[focus=true]:web:outline-none data-[focus-visible=true]:web:ring-2",
  variants: {
    action: {
      primary:
        "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 data-[focus-visible=true]:web:ring-indicator-info",
      secondary:
        "bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 data-[focus-visible=true]:web:ring-indicator-info",
      positive:
        "bg-success-500 hover:bg-success-600 active:bg-success-700 data-[focus-visible=true]:web:ring-indicator-info",
      negative:
        "bg-error-500 hover:bg-error-600 active:bg-error-700 data-[focus-visible=true]:web:ring-indicator-info",
    },
    size: {
      sm: "px-2.5 py-2.5",
      md: "px-3 py-3",
      lg: "px-4 py-4",
    },
    placement: {
      "top right": "right-4 top-4",
      "top left": "left-4 top-4",
      "bottom right": "bottom-4 right-4",
      "bottom left": "bottom-4 left-4",
      "top center": "top-4 self-center",
      "bottom center": "bottom-4 self-center",
    },
  },
});

const fabLabelStyle = tva({
  base: "tracking-md mx-2 text-left font-body font-normal text-typography-50",
  variants: {
    isTruncated: {
      true: "",
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
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
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
  parentVariants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
});

const fabIconStyle = tva({
  base: "fill-none text-typography-50",
  variants: {
    size: {
      "2xs": "h-[12px] w-[12px]",
      xs: "h-[14px] w-[14px]",
      sm: "h-[16px] w-[16px]",
      md: "h-[18px] w-[18px]",
      lg: "h-[20px] w-[20px]",
      xl: "h-[22px] w-[22px]",
    },
  },
});

type IFabProps = Omit<React.ComponentPropsWithoutRef<typeof UIFab>, "context"> &
  VariantProps<typeof fabStyle>;

const Fab = React.forwardRef<React.ComponentRef<typeof UIFab>, IFabProps>(
  function Fab(
    {
      size = "md",
      placement = "bottom right",
      action = "primary",
      className,
      ...props
    },
    ref
  ) {
    return (
      <UIFab
        ref={ref}
        {...props}
        className={fabStyle({ size, placement, action, class: className })}
        context={{ size }}
      />
    );
  }
);

type IFabLabelProps = React.ComponentPropsWithoutRef<typeof UIFab.Label> &
  VariantProps<typeof fabLabelStyle>;

const FabLabel = React.forwardRef<
  React.ComponentRef<typeof UIFab.Label>,
  IFabLabelProps
>(function FabLabel(
  {
    size,
    isTruncated = false,
    bold = false,
    underline = false,
    strikeThrough = false,
    className,
    ...props
  },
  ref
) {
  const { size: parentSize } = useStyleContext(SCOPE);
  return (
    <UIFab.Label
      ref={ref}
      {...props}
      className={fabLabelStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        isTruncated,
        bold,
        underline,
        strikeThrough,
        class: className,
      })}
    />
  );
});

type IFabIconProps = React.ComponentPropsWithoutRef<typeof UIFab.Icon> &
  VariantProps<typeof fabIconStyle> & {
    height?: number;
    width?: number;
  };

const FabIcon = React.forwardRef<
  React.ComponentRef<typeof UIFab.Icon>,
  IFabIconProps
>(function FabIcon({ size, className, ...props }, ref) {
  const { size: parentSize } = useStyleContext(SCOPE);

  if (typeof size === "number") {
    return (
      <UIFab.Icon
        ref={ref}
        {...props}
        className={fabIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIFab.Icon
        ref={ref}
        {...props}
        className={fabIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIFab.Icon
      ref={ref}
      {...props}
      className={fabIconStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
    />
  );
});

Fab.displayName = "Fab";
FabLabel.displayName = "FabLabel";
FabIcon.displayName = "FabIcon";

export { Fab, FabLabel, FabIcon };

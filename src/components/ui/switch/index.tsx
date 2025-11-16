"use client";
import React from "react";
import { Switch as RNSwitch } from "react-native";
import { createSwitch } from "@gluestack-ui/core/switch/creator";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { withStyleContext } from "@gluestack-ui/utils/nativewind-utils";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import colors from "tailwindcss/colors";

const UISwitch = createSwitch({
  Root: withStyleContext(RNSwitch),
});

const switchStyle = tva({
  base: "disabled:cursor-not-allowed data-[invalid=true]:rounded-xl data-[invalid=true]:border-2 data-[invalid=true]:border-error-700 data-[disabled=true]:opacity-40 data-[focus=true]:outline-0 data-[focus=true]:ring-2 data-[focus=true]:ring-indicator-primary web:cursor-pointer",

  variants: {
    size: {
      sm: "scale-75",
      md: "",
      lg: "scale-125",
    },
  },
});

const switchColorPropsByAction = {
  primary: {
    trackColor: {
      false: colors.blue[300],
      true: colors.blue[500],
    },
    thumbColor: colors.blue[100],
    ios_backgroundColor: colors.blue[300],
  },
  secondary: {
    trackColor: {
      false: colors.teal[300],
      true: colors.teal[500],
    },
    thumbColor: colors.teal[100],
    ios_backgroundColor: colors.teal[300],
  },
  positive: {
    trackColor: {
      false: colors.green[300],
      true: colors.green[500],
    },
    thumbColor: colors.green[100],
    ios_backgroundColor: colors.green[300],
  },
  negative: {
    trackColor: {
      false: colors.red[300],
      true: colors.red[500],
    },
    thumbColor: colors.red[100],
    ios_backgroundColor: colors.red[300],
  },
};

type ISwitchProps = React.ComponentProps<typeof UISwitch> &
  VariantProps<typeof switchStyle> & {
    action?: keyof typeof switchColorPropsByAction;
  };
const Switch = React.forwardRef<
  React.ComponentRef<typeof UISwitch>,
  ISwitchProps
>(function Switch(
  { className, size = "md", action = "primary", ...props },
  ref
) {
  const colorProps = switchColorPropsByAction[action];
  const mergedProps = { ...colorProps, ...props };
  return (
    <UISwitch
      ref={ref}
      {...mergedProps}
      className={switchStyle({ size, class: className })}
    />
  );
});

Switch.displayName = "Switch";
export { Switch };

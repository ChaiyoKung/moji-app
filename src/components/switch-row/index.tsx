import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { HStack } from "../ui/hstack";
import { Switch } from "../ui/switch";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import colors from "tailwindcss/colors";

const switchRowTitleStyle = tva({
  base: "",
});

const switchRowDescriptionStyle = tva({
  base: "text-typography-500",
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

export type SwitchRowTitleProps = React.ComponentProps<typeof Text>;

export function SwitchRowTitle({ className, ...props }: SwitchRowTitleProps) {
  return (
    <Text {...props} className={switchRowTitleStyle({ class: className })} />
  );
}

export type SwitchRowDescriptionProps = React.ComponentProps<typeof Text>;

export function SwitchRowDescription({
  className,
  size = "xs",
  ...props
}: SwitchRowDescriptionProps) {
  return (
    <Text
      {...props}
      size={size}
      className={switchRowDescriptionStyle({ class: className })}
    />
  );
}

export interface SwitchRowProps extends React.ComponentProps<typeof Switch> {
  children?: React.ReactNode;
  action?: keyof typeof switchColorPropsByAction;
}

export function SwitchRow({
  action = "primary",
  children,
  ...props
}: SwitchRowProps) {
  const colorProps = switchColorPropsByAction[action];
  const mergedProps = { ...colorProps, ...props };

  return (
    <HStack
      space="sm"
      className="items-center rounded-2xl border border-gray-300 px-4 py-2"
    >
      <VStack className="flex-1">{children}</VStack>
      <Switch {...mergedProps} />
    </HStack>
  );
}

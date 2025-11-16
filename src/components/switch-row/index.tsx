import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { HStack } from "../ui/hstack";
import { Switch } from "../ui/switch";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const switchRowStyle = tva({
  base: "items-center rounded-2xl border border-gray-300 px-4 py-2",
});

const switchRowTitleStyle = tva({
  base: "",
});

const switchRowDescriptionStyle = tva({
  base: "text-typography-500",
});

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

export interface SwitchRowProps
  extends Omit<React.ComponentProps<typeof Switch>, "className">,
    Pick<React.ComponentProps<typeof HStack>, "className"> {
  children?: React.ReactNode;
}

export function SwitchRow({
  action = "primary",
  children,
  className,
  ...props
}: SwitchRowProps) {
  return (
    <HStack space="sm" className={switchRowStyle({ class: className })}>
      <VStack className="flex-1">{children}</VStack>
      <Switch {...props} />
    </HStack>
  );
}

import { CalendarDaysIcon } from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "../ui/button";

export type TodayButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "action"
>;

export function TodayButton(props: TodayButtonProps) {
  return (
    <Button variant="outline" action="secondary" {...props}>
      <ButtonIcon as={CalendarDaysIcon} />
      <ButtonText>กลับมาวันนี้</ButtonText>
    </Button>
  );
}

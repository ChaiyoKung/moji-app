import { CalendarDaysIcon } from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { InterfaceButtonProps } from "@gluestack-ui/button/lib/types";

export interface TodayButtonProps {
  onPress?: InterfaceButtonProps["onPress"];
}

export function TodayButton({ onPress }: TodayButtonProps) {
  return (
    <Button variant="outline" action="secondary" onPress={onPress}>
      <ButtonIcon as={CalendarDaysIcon} />
      <ButtonText>กลับมาวันนี้</ButtonText>
    </Button>
  );
}

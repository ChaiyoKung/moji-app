import { CalendarDaysIcon } from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { InterfaceButtonProps } from "@gluestack-ui/button/lib/types";

export interface TodayButtonProps {
  onPress?: InterfaceButtonProps["onPress"];
}

export function TodayButton({ onPress }: TodayButtonProps) {
  return (
    <Button
      variant="outline"
      className="rounded-2xl border-teal-500 data-[hover=true]:border-teal-600 data-[active=true]:border-teal-700"
      onPress={onPress}
    >
      <ButtonIcon
        as={CalendarDaysIcon}
        className="text-teal-500 data-[hover=true]:text-teal-600 data-[active=true]:text-teal-700"
      />
      <ButtonText className="text-teal-500 data-[hover=true]:text-teal-600 data-[active=true]:text-teal-700">
        กลับมาวันนี้
      </ButtonText>
    </Button>
  );
}

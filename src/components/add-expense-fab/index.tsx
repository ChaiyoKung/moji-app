import { PressableProps } from "react-native";
import { Fab, FabIcon, FabLabel } from "../ui/fab";
import { BanknoteArrowDownIcon } from "lucide-react-native";

export type AddExpenseFabProps = Pick<PressableProps, "onPress">;

export function AddExpenseFab({ onPress }: AddExpenseFabProps) {
  return (
    <Fab
      size="lg"
      placement="bottom right"
      action="negative"
      className="rounded-2xl"
      onPress={onPress}
    >
      <FabLabel bold>เพิ่มรายจ่าย</FabLabel>
      <FabIcon as={BanknoteArrowDownIcon} />
    </Fab>
  );
}

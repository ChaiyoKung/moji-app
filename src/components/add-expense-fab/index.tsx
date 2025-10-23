import { PressableProps } from "react-native";
import { Fab, FabIcon, FabLabel } from "../ui/fab";
import { BanknoteArrowDownIcon } from "lucide-react-native";

export type AddExpenseFabProps = Pick<PressableProps, "onPress">;

export function AddExpenseFab({ onPress }: AddExpenseFabProps) {
  return (
    <Fab
      size="lg"
      placement="bottom right"
      className="rounded-2xl bg-error-500 hover:bg-error-600 active:bg-error-700"
      onPress={onPress}
    >
      <FabLabel bold>เพิ่มรายจ่าย</FabLabel>
      <FabIcon as={BanknoteArrowDownIcon} />
    </Fab>
  );
}

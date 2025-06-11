import { PressableProps } from "react-native";
import { Fab, FabIcon, FabLabel } from "../ui/fab";
import { AddIcon } from "../ui/icon";

export type AddExpenseFabProps = Pick<PressableProps, "onPress">;

export function AddExpenseFab({ onPress }: AddExpenseFabProps) {
  return (
    <Fab
      size="lg"
      placement="bottom right"
      className="rounded-2xl bg-red-500 hover:bg-red-600 active:bg-red-700"
      onPress={onPress}
    >
      <FabLabel bold>เพิ่มรายจ่าย</FabLabel>
      <FabIcon as={AddIcon} />
    </Fab>
  );
}

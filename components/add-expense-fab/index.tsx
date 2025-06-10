import { Fab, FabIcon, FabLabel } from "../ui/fab";
import { AddIcon } from "../ui/icon";

export function AddExpenseFab() {
  return (
    <Fab
      size="lg"
      placement="bottom right"
      className="rounded-2xl bg-red-500 hover:bg-red-600 active:bg-red-700"
    >
      <FabLabel bold>เพิ่มรายจ่าย</FabLabel>
      <FabIcon as={AddIcon} />
    </Fab>
  );
}

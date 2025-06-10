import { Fab, FabIcon, FabLabel } from "../ui/fab";
import { AddIcon } from "../ui/icon";

export function AddIncomeFab() {
  return (
    <Fab
      size="lg"
      placement="bottom left"
      className="rounded-2xl bg-green-500 hover:bg-green-600 active:bg-green-700"
    >
      <FabIcon as={AddIcon} />
      <FabLabel bold>เพิ่มรายรับ</FabLabel>
    </Fab>
  );
}

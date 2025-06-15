import { PressableProps } from "react-native";
import { Fab, FabIcon, FabLabel } from "../ui/fab";
import { BanknoteArrowUpIcon } from "lucide-react-native";

export type AddIncomeFabProps = Pick<PressableProps, "onPress">;

export function AddIncomeFab({ onPress }: AddIncomeFabProps) {
  return (
    <Fab
      size="lg"
      placement="bottom left"
      className="rounded-2xl bg-green-500 hover:bg-green-600 active:bg-green-700"
      onPress={onPress}
    >
      <FabIcon as={BanknoteArrowUpIcon} />
      <FabLabel bold>เพิ่มรายรับ</FabLabel>
    </Fab>
  );
}

import { PressableProps } from "react-native";
import { Fab, FabIcon, FabLabel } from "../ui/fab";
import { BanknoteArrowUpIcon } from "lucide-react-native";

export type AddIncomeFabProps = Pick<PressableProps, "onPress">;

export function AddIncomeFab({ onPress }: AddIncomeFabProps) {
  return (
    <Fab
      size="lg"
      placement="bottom left"
      action="positive"
      className="rounded-2xl"
      onPress={onPress}
    >
      <FabIcon as={BanknoteArrowUpIcon} />
      <FabLabel bold>เพิ่มรายรับ</FabLabel>
    </Fab>
  );
}

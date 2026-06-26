import { View } from "react-native";
import { Spinner } from "../../../components/ui/spinner";

export function LoadingBubble() {
  return (
    <View className="mb-2 self-start">
      <View className="rounded-2xl rounded-tl-sm bg-background-100 px-4 py-3">
        <Spinner size="small" />
      </View>
    </View>
  );
}

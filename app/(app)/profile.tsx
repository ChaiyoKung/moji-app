import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/text";

export default function Profile() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <Text>Profile</Text>
    </SafeAreaView>
  );
}

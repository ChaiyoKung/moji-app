import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/text";

export default function Dashboard() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <Text>Dashboard</Text>
    </SafeAreaView>
  );
}

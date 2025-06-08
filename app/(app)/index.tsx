import { Text } from "../../components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <Text>Home</Text>
    </SafeAreaView>
  );
}

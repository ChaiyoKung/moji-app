import { Text } from "../../components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heading } from "../../components/ui/heading";
import { VStack } from "../../components/ui/vstack";

export default function Home() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <VStack space="md" className="p-4">
        <VStack>
          <Text className="text-gray-500">เงินคงเหลือ</Text>
          <Heading size="xl" className="text-green-500">
            19,934
          </Heading>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}

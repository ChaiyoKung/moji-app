import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { Heading } from "../../components/ui/heading";
import { VStack } from "../../components/ui/vstack";
import { Text } from "../../components/ui/text";
import { Center } from "../../components/ui/center";

export default function Transaction() {
  const { mode, date } = useLocalSearchParams();

  if (mode !== "income" && mode !== "expense") {
    console.error("Invalid mode parameter:", mode);
    return (
      <Center className="flex-1">
        <Text className="text-center text-red-500">
          Error: Invalid mode parameter
        </Text>
      </Center>
    );
  }

  if (typeof date !== "string") {
    console.error("Invalid date parameter:", date);
    return (
      <Center className="flex-1">
        <Text className="text-center text-red-500">
          Error: Invalid date parameter
        </Text>
      </Center>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <VStack space="md" className="p-4">
        <VStack>
          <Heading size="3xl" className="text-typography-black">
            {mode === "income" ? "เพิ่มรายรับ" : "เพิ่มรายจ่าย"}
          </Heading>
          <Text>{`ของวันนี้ (${new Date(date).toISOString()})`}</Text>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

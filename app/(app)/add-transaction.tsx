import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { Heading } from "../../components/ui/heading";
import { VStack } from "../../components/ui/vstack";
import { Text } from "../../components/ui/text";

export default function Transaction() {
  const { mode, date } = useLocalSearchParams();

  if (mode !== "income" && mode !== "expense") {
    throw new Error("Invalid mode parameter.");
  }

  if (typeof date !== "string") {
    throw new Error("Invalid date parameter.");
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <VStack space="md" className="p-4">
        <VStack space="xs">
          <Heading size="3xl" className="text-typography-black">
            {mode === "income" ? "เพิ่มรายรับ" : "เพิ่มรายจ่าย"}
          </Heading>
          <Text>{`ของวันนี้ (${date})`}</Text>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

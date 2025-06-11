import { ErrorBoundaryProps, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { Heading } from "../../components/ui/heading";
import { VStack } from "../../components/ui/vstack";
import { Text } from "../../components/ui/text";
import { Center } from "../../components/ui/center";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  return (
    <Center className="flex-1 bg-gray-100 p-4">
      <Text className="text-center text-red-500">{error.message}</Text>
    </Center>
  );
}

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

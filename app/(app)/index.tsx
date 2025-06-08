import { Text } from "../../components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heading } from "../../components/ui/heading";
import { VStack } from "../../components/ui/vstack";
import { Box } from "../../components/ui/box";
import { Center } from "../../components/ui/center";

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

        <Box className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <Center className="px-4 py-2 border-b border-gray-200 bg-red-100">
            <Text bold className="text-red-800">
              รายจ่าย วันนี้
            </Text>
          </Center>
          <Center className="p-4">
            <Text size="4xl" bold>
              66
            </Text>
          </Center>
        </Box>
      </VStack>
    </SafeAreaView>
  );
}

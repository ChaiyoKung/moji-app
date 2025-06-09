import "../../libs/calendar-locale-config.th";
import { Text } from "../../components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../../components/ui/vstack";
import { BalanceSummary } from "../../components/balance-summary";
import { Box } from "../../components/ui/box";
import { Center } from "../../components/ui/center";
import { Calendar, LocaleConfig } from "react-native-calendars";

LocaleConfig.defaultLocale = "th";

export default function Home() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <VStack space="md" className="p-4">
        <BalanceSummary label="เงินคงเหลือ" value={19934} />

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

        <Calendar
          theme={{
            calendarBackground: "transparent",
            todayBackgroundColor: "#0da6f2",
            todayTextColor: "#ffffff",
            todayDotColor: "#ffffff",
            arrowColor: "#9e9e9e",
          }}
        />
      </VStack>
    </SafeAreaView>
  );
}

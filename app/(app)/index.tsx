import "../../libs/calendar-locale-config.th";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../../components/ui/vstack";
import { BalanceSummary } from "../../components/balance-summary";
import { SummaryCard } from "../../components/summary-card";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { ScrollView } from "react-native";

LocaleConfig.defaultLocale = "th";

export default function Home() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <ScrollView>
        <VStack space="md" className="p-4">
          <BalanceSummary label="เงินคงเหลือ" value={19934} />

          <SummaryCard label="รายจ่าย วันนี้" value={66} />

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
      </ScrollView>
    </SafeAreaView>
  );
}

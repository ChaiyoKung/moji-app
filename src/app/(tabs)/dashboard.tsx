import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";
import dayjs from "dayjs";
import { Center } from "../../components/ui/center";
import { HStack } from "../../components/ui/hstack";
import { Icon } from "../../components/ui/icon";
import { Pressable } from "../../components/ui/pressable";
import { Spinner } from "../../components/ui/spinner";
import { Text } from "../../components/ui/text";
import { VStack } from "../../components/ui/vstack";
import { DashboardCategoryChart } from "../../features/dashboard-category-chart";
import { DashboardDailyChart } from "../../features/dashboard-daily-chart";
import { DashboardMonthlyChart } from "../../features/dashboard-monthly-chart";
import { useDashboardTransactions } from "../../hooks/use-dashboard-transactions";

export default function Dashboard() {
  const currentMonth = dayjs().format("YYYY-MM");
  const [month, setMonth] = useState(currentMonth);
  const query = useDashboardTransactions(month);

  const shiftMonth = (delta: number) =>
    setMonth(dayjs(`${month}-01`).add(delta, "month").format("YYYY-MM"));

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background-100">
      <HStack className="items-center justify-between px-4 py-2">
        <Pressable
          accessibilityLabel="เดือนก่อนหน้า"
          onPress={() => shiftMonth(-1)}
          className="p-2"
        >
          <Icon as={ChevronLeftIcon} size="lg" />
        </Pressable>
        <Text bold size="lg">
          {dayjs(`${month}-01`).format("MMMM YYYY")}
        </Text>
        <Pressable
          accessibilityLabel="เดือนถัดไป"
          disabled={month >= currentMonth}
          onPress={() => shiftMonth(1)}
          className="p-2 disabled:opacity-30"
        >
          <Icon as={ChevronRightIcon} size="lg" />
        </Pressable>
      </HStack>

      {query.isLoading ? (
        <Center className="flex-1">
          <Spinner />
        </Center>
      ) : query.isError || query.data === undefined ? (
        <Center className="flex-1">
          <Text className="text-error-500">ไม่สามารถโหลดข้อมูลได้</Text>
        </Center>
      ) : (
        <ScrollView>
          <VStack space="md" className="p-4">
            <DashboardMonthlyChart transactions={query.data} month={month} />
            <DashboardCategoryChart transactions={query.data} month={month} />
            <DashboardDailyChart transactions={query.data} month={month} />
          </VStack>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

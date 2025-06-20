import "../../libs/calendar-locale-config.th";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../../components/ui/vstack";
import { BalanceSummary } from "../../components/balance-summary";
import { SummaryCard } from "../../components/summary-card";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { ScrollView } from "react-native";
import { Heading } from "../../components/ui/heading";
import { Center } from "../../components/ui/center";
import { TodayButton } from "../../components/today-button";
import { AddIncomeFab } from "../../components/add-income-fab";
import { AddExpenseFab } from "../../components/add-expense-fab";
import { router } from "expo-router";
import { useState } from "react";
import colors from "tailwindcss/colors";
import { fromNowDate, nowDate } from "../../libs/dayjs";
import { TransactionItem } from "../../components/transaction-item";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts, getAllTransactions } from "../../libs/api";
import { Text } from "../../components/ui/text";
import { Spinner } from "../../components/ui/spinner";

LocaleConfig.defaultLocale = "th";

export default function Home() {
  const todayDate = nowDate();
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);

  const accountQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
  });

  const transactionsQuery = useQuery({
    queryKey: ["transactions", selectedDate],
    queryFn: () =>
      getAllTransactions({ startDate: selectedDate, endDate: selectedDate }),
  });

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <ScrollView>
        <VStack space="md" className="p-4 pb-[5.75rem]">
          <BalanceSummary
            label="เงินคงเหลือ"
            value={accountQuery.data?.[0]?.balance}
            isLoading={accountQuery.isLoading}
            error={accountQuery.error}
          />

          <SummaryCard
            label={`รายจ่าย${fromNowDate(selectedDate)}`}
            value={66}
          />

          <VStack>
            {selectedDate !== todayDate && (
              <Center>
                <TodayButton onPress={() => setSelectedDate(todayDate)} />
              </Center>
            )}
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
              }}
              maxDate={todayDate}
              enableSwipeMonths={true}
              theme={{
                calendarBackground: colors.transparent,
                arrowColor: colors.gray[500],
                monthTextColor: colors.gray[800],
                dayTextColor: colors.gray[800],
                selectedDayBackgroundColor: colors.blue[500],
                selectedDayTextColor: colors.white,
                todayTextColor: colors.blue[500],
                textDisabledColor: colors.gray[300],
                textSectionTitleColor: colors.gray[500],
              }}
            />
          </VStack>

          <VStack space="sm">
            <Heading size="lg" bold className="text-typography-500">
              รายการ
            </Heading>
            {transactionsQuery.isLoading ? (
              <Center className="h-40">
                <Spinner />
              </Center>
            ) : transactionsQuery.error ? (
              <Center className="h-40">
                <Text className="text-red-500">ไม่สามารถโหลดรายการได้</Text>
              </Center>
            ) : transactionsQuery.data === undefined ||
              transactionsQuery.data.length === 0 ? (
              <Center className="h-40">
                <Text className="text-gray-500">{`ไม่พบรายการใน${fromNowDate(selectedDate)}`}</Text>
              </Center>
            ) : (
              transactionsQuery.data.map((item) => (
                <TransactionItem key={item._id} data={item} />
              ))
            )}
          </VStack>
        </VStack>
      </ScrollView>

      <AddIncomeFab
        onPress={() =>
          router.push({
            pathname: "/add-transaction",
            params: { mode: "income", date: selectedDate },
          })
        }
      />
      <AddExpenseFab
        onPress={() =>
          router.push({
            pathname: "/add-transaction",
            params: { mode: "expense", date: selectedDate },
          })
        }
      />
    </SafeAreaView>
  );
}

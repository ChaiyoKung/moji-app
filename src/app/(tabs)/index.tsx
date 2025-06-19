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
import type { Transaction } from "../../components/transaction-item";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "../../libs/api";

const transactions: Transaction[] = [
  {
    _id: "txn001",
    type: "expense",
    amount: 16,
    currency: "THB",
    note: "",
    date: new Date("2025-06-08T08:30:00.000Z"),
    category: {
      name: "เครื่องดื่ม",
      icon: "🥤",
      color: "#3498db",
    },
  },
  {
    _id: "txn002",
    type: "expense",
    amount: 50,
    currency: "THB",
    note: "ข้าวกะเพราหมูกรอบ",
    date: new Date("2025-06-08T12:30:00.000Z"),
    category: {
      name: "อาหาร",
      icon: "🍛",
      color: "#f39c12",
    },
  },
  {
    _id: "txn003",
    type: "income",
    amount: 20000,
    currency: "THB",
    note: "เงินเดือน",
    date: new Date("2025-06-01T00:00:00.000Z"),
    category: {
      name: "ได้เงิน",
      icon: "💰",
      color: "#27ae60",
    },
  },
  {
    _id: "txn004",
    type: "expense",
    amount: 120,
    currency: "THB",
    note: "เติมน้ำมัน",
    date: new Date("2025-06-07T17:00:00.000Z"),
    category: {
      name: "เดินทาง",
      icon: "⛽",
      color: "#e74c3c",
    },
  },
  {
    _id: "txn005",
    type: "income",
    amount: 500,
    currency: "THB",
    note: "ขายของเก่า",
    date: new Date("2025-06-05T10:15:00.000Z"),
    category: {
      name: "รายได้เสริม",
      icon: "📦",
      color: "#2ecc71",
    },
  },
];

LocaleConfig.defaultLocale = "th";

export default function Home() {
  const todayDate = nowDate();
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);

  const accountQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
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
            {transactions.map((item) => (
              <TransactionItem key={item._id} data={item} />
            ))}
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

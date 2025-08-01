import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../../components/ui/vstack";
import { BalanceSummary } from "../../components/balance-summary";
import { ExpenseSummaryCard } from "../../components/expense-summary-card";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native";
import { Heading } from "../../components/ui/heading";
import { Center } from "../../components/ui/center";
import { TodayButton } from "../../components/today-button";
import { AddIncomeFab } from "../../components/add-income-fab";
import { AddExpenseFab } from "../../components/add-expense-fab";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import colors from "tailwindcss/colors";
import { fromNowDate, nowDate } from "../../libs/dayjs";
import dayjs from "dayjs";
import { SwipeableTransactionItem } from "../../components/swipeable-transaction-item";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAccount,
  getAllAccounts,
  getAllTransactions,
  getTransactionIdsByDate,
} from "../../libs/api";
import { Text } from "../../components/ui/text";
import { Spinner } from "../../components/ui/spinner";
import { getMarkedDates } from "../../utils/calendar-marking";
import { BalanceSetupModal } from "../../components/balance-setup-modal";
import { useSession } from "../../components/session-provider";
import { useAppToast } from "../../hooks/use-app-toast";

export default function Home() {
  const todayDate = nowDate();
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);
  const [currentMonth, setCurrentMonth] = useState<string>(
    dayjs(todayDate).format("YYYY-MM")
  );
  const [showBalanceModal, setShowBalanceModal] = useState<boolean>(false);

  const toast = useAppToast();

  const accountQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
  });

  const transactionsQuery = useQuery({
    queryKey: ["transactions", selectedDate],
    queryFn: () =>
      getAllTransactions({
        startDate: selectedDate,
        endDate: selectedDate,
        timezone: dayjs.tz.guess(),
      }),
  });

  const startOfMonth = dayjs(currentMonth + "-01")
    .startOf("month")
    .format("YYYY-MM-DD");
  const endOfMonth = dayjs(currentMonth + "-01")
    .endOf("month")
    .format("YYYY-MM-DD");
  const transactionIdsByDateQuery = useQuery({
    queryKey: ["transactionIdsByDate", startOfMonth, endOfMonth],
    queryFn: () =>
      getTransactionIdsByDate({
        startDate: startOfMonth,
        endDate: endOfMonth,
        timezone: dayjs.tz.guess(),
      }),
  });

  const markedDates = getMarkedDates(
    transactionIdsByDateQuery.data ?? [],
    selectedDate
  );

  const isBalanceDataMissing =
    accountQuery.isSuccess && accountQuery.data[0]?.balance === undefined;

  // Show modal if accountQuery loaded and no balance data
  useEffect(() => {
    if (isBalanceDataMissing) {
      setShowBalanceModal(true);
    }
  }, [isBalanceDataMissing]);

  const createAccountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      accountQuery.refetch();
      setShowBalanceModal(false);
    },
    onError: (error) => {
      console.error("Failed to create account:", error);
      toast.error("ไม่สามารถสร้างบัญชีได้", "กรุณาลองใหม่อีกครั้ง");
    },
  });

  const { userId } = useSession();

  const handleSaveBalance = (balance: string) => {
    if (!userId) {
      console.error("User ID is not available. Cannot create account.");
      toast.error("ไม่พบข้อมูลผู้ใช้", "กรุณาลองใหม่อีกครั้ง");
      return;
    }

    createAccountMutation.mutate({
      userId: userId,
      name: "กระเป๋าสตางค์",
      type: "cash",
      balance: parseFloat(balance),
      currency: "THB",
      icon: "💵",
    });
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <ScrollView>
        <VStack space="md" className="p-4 pb-[5.75rem]">
          <BalanceSummary />

          <ExpenseSummaryCard date={selectedDate} />

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
              onMonthChange={(month) => {
                setCurrentMonth(dayjs(month.dateString).format("YYYY-MM"));
              }}
              current={selectedDate}
              maxDate={todayDate}
              enableSwipeMonths={true}
              displayLoadingIndicator={transactionIdsByDateQuery.isLoading}
              markedDates={markedDates}
              markingType="multi-dot"
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

          <VStack space="sm" className="-mx-4">
            <Heading size="lg" bold className="text-typography-500 px-4">
              รายการ
            </Heading>
            {transactionsQuery.isLoading ? (
              <Center className="h-40 px-4">
                <Spinner />
              </Center>
            ) : transactionsQuery.error ? (
              <Center className="h-40 px-4">
                <Text className="text-red-500">ไม่สามารถโหลดรายการได้</Text>
              </Center>
            ) : transactionsQuery.data === undefined ||
              transactionsQuery.data.length === 0 ? (
              <Center className="h-40 px-4">
                <Text className="text-gray-500">{`ไม่พบรายการใน${fromNowDate(selectedDate)}`}</Text>
              </Center>
            ) : (
              transactionsQuery.data.map((item) => (
                <SwipeableTransactionItem key={item._id} data={item} />
              ))
            )}
          </VStack>
        </VStack>
      </ScrollView>

      <AddIncomeFab
        onPress={() =>
          isBalanceDataMissing
            ? setShowBalanceModal(true)
            : router.push({
                pathname: "/add-transaction",
                params: { type: "income", date: selectedDate },
              })
        }
      />
      <AddExpenseFab
        onPress={() =>
          isBalanceDataMissing
            ? setShowBalanceModal(true)
            : router.push({
                pathname: "/add-transaction",
                params: { type: "expense", date: selectedDate },
              })
        }
      />

      <BalanceSetupModal
        isOpen={showBalanceModal}
        onClose={() => setShowBalanceModal(false)}
        isSaving={createAccountMutation.isPending}
        onSave={handleSaveBalance}
      />
    </SafeAreaView>
  );
}

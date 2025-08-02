import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../../components/ui/vstack";
import { BalanceSummary } from "../../features/balance-summary";
import { ExpenseSummaryCard } from "../../features/expense-summary-card";
import { TransactionCalendar } from "../../features/calendar-with-marking";
import { ScrollView } from "react-native";
import { Heading } from "../../components/ui/heading";
import { Center } from "../../components/ui/center";
import { TodayButton } from "../../components/today-button";
import { AddIncomeFab } from "../../components/add-income-fab";
import { AddExpenseFab } from "../../components/add-expense-fab";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { nowDate } from "../../libs/dayjs";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "../../libs/api";
import { TransactionList } from "../../features/transaction-list";
import { BalanceSetupModal } from "../../features/balance-setup-modal";

export default function Home() {
  const todayDate = nowDate();
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);
  const [showBalanceModal, setShowBalanceModal] = useState<boolean>(false);

  const accountQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
  });

  const isBalanceDataMissing =
    accountQuery.isSuccess && accountQuery.data[0]?.balance === undefined;

  // Show modal if accountQuery loaded and no balance data
  useEffect(() => {
    if (isBalanceDataMissing) {
      setShowBalanceModal(true);
    }
  }, [isBalanceDataMissing]);

  const handleAddTransaction = (type: "income" | "expense") => {
    if (isBalanceDataMissing) {
      setShowBalanceModal(true);
      return;
    }

    router.push({
      pathname: "/add-transaction",
      params: { type, date: selectedDate },
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
            <TransactionCalendar
              selectedDate={selectedDate}
              onSelectedDateChange={setSelectedDate}
              todayDate={todayDate}
            />
          </VStack>

          <VStack space="sm" className="-mx-4">
            <Heading size="lg" bold className="text-typography-500 px-4">
              รายการ
            </Heading>
            <TransactionList selectedDate={selectedDate} />
          </VStack>
        </VStack>
      </ScrollView>

      <AddIncomeFab onPress={() => handleAddTransaction("income")} />
      <AddExpenseFab onPress={() => handleAddTransaction("expense")} />

      <BalanceSetupModal
        isOpen={showBalanceModal}
        onClose={() => setShowBalanceModal(false)}
      />
    </SafeAreaView>
  );
}

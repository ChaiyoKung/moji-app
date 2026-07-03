import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native";
import { VStack } from "../../components/ui/vstack";
import { Box } from "../../components/ui/box";
import { Heading } from "../../components/ui/heading";
import { Center } from "../../components/ui/center";
import { Text } from "../../components/ui/text";
import { Spinner } from "../../components/ui/spinner";
import { AccountBalanceSummary } from "../../features/account-balance-summary";
import { ExpenseSummaryCard } from "../../features/expense-summary-card";
import { TransactionCalendar } from "../../features/transaction-calendar";
import { SwipeableTransactionItem } from "../../features/swipeable-transaction-item";
import { TodayButton } from "../../components/today-button";
import { AddIncomeFab } from "../../components/add-income-fab";
import { AddExpenseFab } from "../../components/add-expense-fab";
import { AccountBalanceSetupModal } from "../../features/account-balance-setup-modal";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { nowDate, fromNowDate } from "../../libs/dayjs";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts, getAllTransactions } from "../../libs/api";
import type { TransactionWithCategory } from "../../libs/api";
import dayjs from "dayjs";

interface HomeHeaderProps {
  selectedDate: string;
  todayDate: string;
  onSelectedDateChange: (date: string) => void;
}

export function HomeHeader({
  selectedDate,
  todayDate,
  onSelectedDateChange,
}: HomeHeaderProps) {
  return (
    <VStack space="md" className="p-4">
      <AccountBalanceSummary />
      <ExpenseSummaryCard date={selectedDate} />
      <VStack>
        {selectedDate !== todayDate && (
          <Center>
            <TodayButton onPress={() => onSelectedDateChange(todayDate)} />
          </Center>
        )}
        <TransactionCalendar
          selectedDate={selectedDate}
          onSelectedDateChange={onSelectedDateChange}
          todayDate={todayDate}
        />
      </VStack>
      <Heading size="lg" bold className="text-typography-500">
        รายการ
      </Heading>
    </VStack>
  );
}

interface HomeEmptyProps {
  isLoading: boolean;
  isError: boolean;
  selectedDate: string;
}

export function HomeEmpty({
  isLoading,
  isError,
  selectedDate,
}: HomeEmptyProps) {
  if (isLoading) {
    return (
      <Center className="h-40 px-4">
        <Spinner />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center className="h-40 px-4">
        <Text className="text-error-500">ไม่สามารถโหลดรายการได้</Text>
      </Center>
    );
  }

  return (
    <Center className="h-40 px-4">
      <Text className="text-typography-500">
        {`ไม่พบรายการใน${fromNowDate(selectedDate)}`}
      </Text>
    </Center>
  );
}

export default function Home() {
  const todayDate = nowDate();
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);
  const [showBalanceModal, setShowBalanceModal] = useState<boolean>(false);

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

  const isBalanceDataMissing =
    accountQuery.isSuccess && accountQuery.data[0]?.balance === undefined;

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
    <SafeAreaView edges={["top"]} className="flex-1 bg-background-100">
      <FlatList<TransactionWithCategory>
        data={transactionsQuery.data ?? []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <SwipeableTransactionItem data={item} />}
        ListHeaderComponent={
          <HomeHeader
            selectedDate={selectedDate}
            todayDate={todayDate}
            onSelectedDateChange={setSelectedDate}
          />
        }
        ListEmptyComponent={
          <HomeEmpty
            isLoading={transactionsQuery.isLoading}
            isError={transactionsQuery.isError}
            selectedDate={selectedDate}
          />
        }
        ItemSeparatorComponent={() => <Box className="h-2" />}
        className="flex-1"
        contentContainerClassName="pb-[5.75rem]"
      />

      <AddIncomeFab onPress={() => handleAddTransaction("income")} />
      <AddExpenseFab onPress={() => handleAddTransaction("expense")} />

      <AccountBalanceSetupModal
        isOpen={showBalanceModal}
        onClose={() => setShowBalanceModal(false)}
      />
    </SafeAreaView>
  );
}

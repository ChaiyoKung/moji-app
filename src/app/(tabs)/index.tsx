import "../../libs/calendar-locale-config.th";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../../components/ui/vstack";
import { BalanceSummary } from "../../components/balance-summary";
import { SummaryCard, SummaryCardValue } from "../../components/summary-card";
import { Calendar, LocaleConfig } from "react-native-calendars";
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
  getSummary,
  getTransactionIdsByDate,
} from "../../libs/api";
import { Text } from "../../components/ui/text";
import { Spinner } from "../../components/ui/spinner";
import { getMarkedDates } from "../../utils/calendar-marking";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../../components/ui/modal";
import { Icon } from "../../components/ui/icon";
import { SaveIcon, X } from "lucide-react-native";
import { Input, InputField } from "../../components/ui/input";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "../../components/ui/button";
import { useSession } from "../../components/session-provider";
import { useAppToast } from "../../hooks/use-app-toast";

LocaleConfig.defaultLocale = "th";

export default function Home() {
  const todayDate = nowDate();
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);
  const [currentMonth, setCurrentMonth] = useState<string>(
    dayjs(todayDate).format("YYYY-MM")
  );
  const [showBalanceModal, setShowBalanceModal] = useState<boolean>(false);
  const [inputBalance, setInputBalance] = useState<string>("");

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

  const summaryQuery = useQuery({
    queryKey: ["summary", selectedDate],
    queryFn: () =>
      getSummary({
        type: "expense",
        date: selectedDate,
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

  const handleSaveBalance = () => {
    if (!userId) {
      console.error("User ID is not available. Cannot create account.");
      toast.error("ไม่พบข้อมูลผู้ใช้", "กรุณาลองใหม่อีกครั้ง");
      return;
    }

    createAccountMutation.mutate({
      userId: userId,
      name: "กระเป๋าสตางค์",
      type: "cash",
      balance: parseFloat(inputBalance),
      currency: "THB",
      icon: "💵",
    });
  };

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

          <SummaryCard label={`รายจ่าย${fromNowDate(selectedDate)}`}>
            {summaryQuery.isLoading ? (
              <Spinner />
            ) : summaryQuery.isError ? (
              <Text className="text-red-500">ไม่สามารถโหลดข้อมูลได้</Text>
            ) : summaryQuery.data === undefined ? (
              <Text className="text-gray-500">ไม่พบข้อมูล</Text>
            ) : (
              <SummaryCardValue value={summaryQuery.data.total} />
            )}
          </SummaryCard>

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
                params: { mode: "income", date: selectedDate },
              })
        }
      />
      <AddExpenseFab
        onPress={() =>
          isBalanceDataMissing
            ? setShowBalanceModal(true)
            : router.push({
                pathname: "/add-transaction",
                params: { mode: "expense", date: selectedDate },
              })
        }
      />

      <Modal
        isOpen={showBalanceModal}
        onClose={() => setShowBalanceModal(false)}
      >
        <ModalBackdrop />
        <ModalContent className="rounded-2xl">
          <ModalHeader>
            <Heading size="md" className="text-typography-black">
              กรอกยอดเงินคงเหลือ
            </Heading>
            <ModalCloseButton>
              <Icon
                as={X}
                size="md"
                className="text-gray-500 group-[:hover]/modal-close-button:text-gray-600 group-[:active]/modal-close-button:text-gray-700 group-[:focus-visible]/modal-close-button:text-gray-700"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text size="sm" className="text-gray-500 mb-2">
              กรุณากรอกยอดเงินคงเหลือปัจจุบันของคุณ เพื่อเริ่มต้นใช้งานแอป
            </Text>
            <Input className="rounded-2xl">
              <InputField
                type="text"
                value={inputBalance}
                onChangeText={setInputBalance}
                placeholder="0"
                keyboardType="numeric"
                autoFocus
              />
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={!inputBalance || createAccountMutation.isPending}
              onPress={handleSaveBalance}
              className="rounded-2xl"
            >
              {createAccountMutation.isPending ? (
                <ButtonSpinner />
              ) : (
                <ButtonIcon as={SaveIcon} />
              )}
              <ButtonText>บันทึก</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}

import { Center } from "../../components/ui/center";
import { Text } from "../../components/ui/text";
import { Spinner } from "../../components/ui/spinner";
import { SwipeableTransactionItem } from "../swipeable-transaction-item";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "../../libs/api";
import { fromNowDate } from "../../libs/dayjs";
import dayjs from "dayjs";

export interface TransactionListProps {
  selectedDate: string;
}

export function TransactionList({ selectedDate }: TransactionListProps) {
  const transactionsQuery = useQuery({
    queryKey: ["transactions", selectedDate],
    queryFn: () =>
      getAllTransactions({
        startDate: selectedDate,
        endDate: selectedDate,
        timezone: dayjs.tz.guess(),
      }),
  });

  if (transactionsQuery.isLoading) {
    return (
      <Center className="h-40 px-4">
        <Spinner />
      </Center>
    );
  }

  if (transactionsQuery.error) {
    return (
      <Center className="h-40 px-4">
        <Text className="text-error-500">ไม่สามารถโหลดรายการได้</Text>
      </Center>
    );
  }

  if (
    transactionsQuery.data === undefined ||
    transactionsQuery.data.length === 0
  ) {
    return (
      <Center className="h-40 px-4">
        <Text className="text-typography-500">
          {`ไม่พบรายการใน${fromNowDate(selectedDate)}`}
        </Text>
      </Center>
    );
  }

  return transactionsQuery.data.map((item) => (
    <SwipeableTransactionItem key={item._id} data={item} />
  ));
}

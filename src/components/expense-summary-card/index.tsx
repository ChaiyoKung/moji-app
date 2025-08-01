import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../../libs/api";
import { fromNowDate } from "../../libs/dayjs";
import { SummaryCard, SummaryCardValue } from "../../components/summary-card";
import { Spinner } from "../../components/ui/spinner";
import { Text } from "../../components/ui/text";
import dayjs from "dayjs";

export interface ExpenseSummaryCardProps {
  date: string;
}

export function ExpenseSummaryCard({ date }: ExpenseSummaryCardProps) {
  const summaryQuery = useQuery({
    queryKey: ["summary", date],
    queryFn: () =>
      getSummary({
        type: "expense",
        date,
        timezone: dayjs.tz.guess(),
      }),
  });

  return (
    <SummaryCard label={`รายจ่าย${fromNowDate(date)}`}>
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
  );
}

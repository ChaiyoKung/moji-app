import { BarChart } from "../../components/bar-chart";
import { DashboardCard } from "../../components/dashboard-card";
import type { TransactionWithCategory } from "../../libs/api";
import { useChartColors } from "../../libs/chart-colors";
import { sumExpenseByDay } from "../../utils/dashboard-stats";

export interface DashboardDailyChartProps {
  transactions: TransactionWithCategory[];
  month: string;
}

export function DashboardDailyChart({
  transactions,
  month,
}: DashboardDailyChartProps) {
  const [, expense] = useChartColors();
  const days = sumExpenseByDay(transactions, month);

  return (
    <DashboardCard title="รายจ่ายรายวัน">
      <BarChart
        data={days.map((value, i) => ({
          label: `${i + 1}`,
          values: [value],
        }))}
        colors={[expense]}
        seriesNames={["รายจ่าย"]}
        labelEvery={5}
      />
    </DashboardCard>
  );
}

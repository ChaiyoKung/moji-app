import dayjs from "dayjs";
import { BarChart } from "../../components/bar-chart";
import { DashboardCard } from "../../components/dashboard-card";
import type { TransactionWithCategory } from "../../libs/api";
import { useChartColors } from "../../libs/chart-colors";
import { lastMonths, sumByMonth } from "../../utils/dashboard-stats";
import { DASHBOARD_MONTHS } from "../../hooks/use-dashboard-transactions";

export interface DashboardMonthlyChartProps {
  transactions: TransactionWithCategory[];
  month: string;
}

export function DashboardMonthlyChart({
  transactions,
  month,
}: DashboardMonthlyChartProps) {
  const [income, expense] = useChartColors();
  const months = lastMonths(month, DASHBOARD_MONTHS);
  const totals = sumByMonth(transactions, months);

  return (
    <DashboardCard title="รายรับ รายจ่าย รายเดือน">
      <BarChart
        data={totals.map((t) => ({
          label: dayjs(`${t.month}-01`).format("MMM"),
          values: [t.income, t.expense],
        }))}
        colors={[income, expense]}
        seriesNames={["รายรับ", "รายจ่าย"]}
      />
    </DashboardCard>
  );
}

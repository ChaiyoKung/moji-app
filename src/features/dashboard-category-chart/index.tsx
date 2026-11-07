import dayjs from "dayjs";
import { DashboardCard } from "../../components/dashboard-card";
import { DonutChart } from "../../components/donut-chart";
import { Text } from "../../components/ui/text";
import type { TransactionWithCategory } from "../../libs/api";
import { useChartColors } from "../../libs/chart-colors";
import { sumExpenseByCategory } from "../../utils/dashboard-stats";

export interface DashboardCategoryChartProps {
  transactions: TransactionWithCategory[];
  month: string;
}

export function DashboardCategoryChart({
  transactions,
  month,
}: DashboardCategoryChartProps) {
  const colors = useChartColors();
  const categories = sumExpenseByCategory(
    transactions,
    month,
    dayjs.tz.guess(),
    colors.length
  );

  return (
    <DashboardCard title="รายจ่ายตามหมวดหมู่">
      {categories.length === 0 ? (
        <Text className="text-typography-500">ไม่มีรายจ่ายในเดือนนี้</Text>
      ) : (
        <DonutChart
          items={categories.map((c, i) => ({
            id: c.id,
            label: c.name,
            value: c.total,
            color: colors[i],
          }))}
        />
      )}
    </DashboardCard>
  );
}

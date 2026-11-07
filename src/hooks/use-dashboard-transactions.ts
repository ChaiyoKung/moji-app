import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getAllTransactions } from "../libs/api";

export const DASHBOARD_MONTHS = 6;

export function useDashboardTransactions(month: string) {
  const timezone = dayjs.tz.guess();
  const start = dayjs(`${month}-01`).subtract(DASHBOARD_MONTHS - 1, "month");
  const end = dayjs(`${month}-01`).endOf("month");

  return useQuery({
    queryKey: ["transactions", "dashboard", month, timezone],
    queryFn: () =>
      getAllTransactions({
        startDate: start.format("YYYY-MM-DD"),
        endDate: end.format("YYYY-MM-DD"),
        timezone,
      }),
  });
}

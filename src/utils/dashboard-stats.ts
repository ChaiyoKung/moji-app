import dayjs from "dayjs";
import type { TransactionWithCategory } from "../libs/api";

export interface MonthTotal {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryTotal {
  id: string;
  name: string;
  total: number;
}

const OTHER_ID = "other";
const OTHER_NAME = "อื่น ๆ";
const UNKNOWN_NAME = "ไม่ระบุ";

function isConfirmed(t: TransactionWithCategory) {
  return t.status !== "draft";
}

/** Returns `count` months in "YYYY-MM" format, oldest first, ending at `month`. */
export function lastMonths(month: string, count: number): string[] {
  const end = dayjs(`${month}-01`);
  return Array.from({ length: count }, (_, i) =>
    end.subtract(count - 1 - i, "month").format("YYYY-MM")
  );
}

export function sumByMonth(
  list: TransactionWithCategory[],
  months: string[]
): MonthTotal[] {
  const totals = new Map<string, MonthTotal>(
    months.map((month) => [month, { month, income: 0, expense: 0 }])
  );
  for (const t of list) {
    if (!isConfirmed(t)) continue;
    const entry = totals.get(dayjs(t.date).format("YYYY-MM"));
    if (entry) entry[t.type] += t.amount ?? 0;
  }
  return months.map((month) => totals.get(month)!);
}

/** Expense total for each day of `month`. Index 0 is day 1. */
export function sumExpenseByDay(
  list: TransactionWithCategory[],
  month: string
): number[] {
  const days = Array<number>(dayjs(`${month}-01`).daysInMonth()).fill(0);
  for (const t of list) {
    if (!isConfirmed(t) || t.type !== "expense") continue;
    const date = dayjs(t.date);
    if (date.format("YYYY-MM") === month)
      days[date.date() - 1] += t.amount ?? 0;
  }
  return days;
}

/** Expense totals by category for `month`, largest first. The tail is folded into "other". */
export function sumExpenseByCategory(
  list: TransactionWithCategory[],
  month: string,
  maxSlices: number
): CategoryTotal[] {
  const totals = new Map<string, CategoryTotal>();
  for (const t of list) {
    if (!isConfirmed(t) || t.type !== "expense") continue;
    if (dayjs(t.date).format("YYYY-MM") !== month) continue;
    const id = t.categoryId?._id ?? "unknown";
    const entry = totals.get(id) ?? {
      id,
      name: t.categoryId?.name ?? UNKNOWN_NAME,
      total: 0,
    };
    entry.total += t.amount ?? 0;
    totals.set(id, entry);
  }

  const sorted = [...totals.values()]
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
  if (sorted.length <= maxSlices) return sorted;

  const head = sorted.slice(0, maxSlices - 1);
  const tail = sorted.slice(maxSlices - 1);
  return [
    ...head,
    {
      id: OTHER_ID,
      name: OTHER_NAME,
      total: tail.reduce((sum, c) => sum + c.total, 0),
    },
  ];
}

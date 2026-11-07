import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { TransactionWithCategory } from "../libs/api";
import {
  lastMonths,
  sumByMonth,
  sumExpenseByCategory,
  sumExpenseByDay,
} from "./dashboard-stats";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Bangkok";

function tx(
  date: string,
  type: "income" | "expense",
  amount: number | undefined,
  category = { _id: "c1", name: "อาหาร" },
  status?: "draft" | "confirmed"
) {
  return {
    _id: `${date}-${type}-${amount}`,
    type,
    amount,
    status,
    date: new Date(date),
    categoryId: category,
  } as unknown as TransactionWithCategory;
}

describe("lastMonths", () => {
  it("returns months oldest first and crosses year boundary", () => {
    expect(lastMonths("2026-02", 4)).toEqual([
      "2025-11",
      "2025-12",
      "2026-01",
      "2026-02",
    ]);
  });
});

describe("sumByMonth", () => {
  it("sums income and expense per month and skips drafts", () => {
    const list = [
      tx("2026-10-05T03:00:00Z", "expense", 100),
      tx("2026-10-06T03:00:00Z", "income", 500),
      tx("2026-11-01T03:00:00Z", "expense", 40),
      tx("2026-11-02T03:00:00Z", "expense", 999, undefined, "draft"),
      tx("2026-11-02T03:00:00Z", "expense", undefined),
    ];
    expect(sumByMonth(list, ["2026-10", "2026-11"], TZ)).toEqual([
      { month: "2026-10", income: 500, expense: 100 },
      { month: "2026-11", income: 0, expense: 40 },
    ]);
  });

  it("uses the local timezone for month edges", () => {
    // 2026-10-31T18:00Z is 2026-11-01 01:00 in Bangkok
    const list = [tx("2026-10-31T18:00:00Z", "expense", 70)];
    expect(sumByMonth(list, ["2026-10", "2026-11"], TZ)).toEqual([
      { month: "2026-10", income: 0, expense: 0 },
      { month: "2026-11", income: 0, expense: 70 },
    ]);
  });
});

describe("sumExpenseByDay", () => {
  it("returns one value per day and ignores income", () => {
    const list = [
      tx("2026-11-01T03:00:00Z", "expense", 10),
      tx("2026-11-01T05:00:00Z", "expense", 5),
      tx("2026-11-30T03:00:00Z", "expense", 7),
      tx("2026-11-15T03:00:00Z", "income", 900),
    ];
    const days = sumExpenseByDay(list, "2026-11", TZ);
    expect(days).toHaveLength(30);
    expect(days[0]).toBe(15);
    expect(days[29]).toBe(7);
    expect(days[14]).toBe(0);
  });
});

describe("sumExpenseByCategory", () => {
  const food = { _id: "f", name: "อาหาร" };
  const bus = { _id: "b", name: "เดินทาง" };
  const fun = { _id: "n", name: "บันเทิง" };

  it("sorts by total, largest first", () => {
    const list = [
      tx("2026-11-01T03:00:00Z", "expense", 10, bus),
      tx("2026-11-02T03:00:00Z", "expense", 30, food),
      tx("2026-11-03T03:00:00Z", "expense", 20, food),
    ];
    expect(sumExpenseByCategory(list, "2026-11", TZ, 5)).toEqual([
      { id: "f", name: "อาหาร", total: 50 },
      { id: "b", name: "เดินทาง", total: 10 },
    ]);
  });

  it("folds the tail into other", () => {
    const list = [
      tx("2026-11-01T03:00:00Z", "expense", 30, food),
      tx("2026-11-01T03:00:00Z", "expense", 20, bus),
      tx("2026-11-01T03:00:00Z", "expense", 10, fun),
    ];
    expect(sumExpenseByCategory(list, "2026-11", TZ, 2)).toEqual([
      { id: "f", name: "อาหาร", total: 30 },
      { id: "other", name: "อื่น ๆ", total: 30 },
    ]);
  });

  it("ignores other months", () => {
    const list = [tx("2026-10-01T03:00:00Z", "expense", 30, food)];
    expect(sumExpenseByCategory(list, "2026-11", TZ, 5)).toEqual([]);
  });
});

import dayjs from "dayjs";

export function nowDate(): string {
  return dayjs().format("YYYY-MM-DD");
}

export function fromNowDate(date: string): string {
  if (dayjs(date).isToday()) return "วันนี้";
  if (dayjs(date).isYesterday()) return "เมื่อวาน";
  return dayjs(date).format("วันที่ D MMMM YYYY");
}

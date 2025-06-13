import dayjs from "dayjs";

export function nowDate(): string {
  return dayjs().format("YYYY-MM-DD");
}

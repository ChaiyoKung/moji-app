import { Text } from "../ui/text";
import dayjs from "dayjs";

export interface DateLabelProps {
  date: dayjs.ConfigType;
}

export function DateLabel({ date }: DateLabelProps) {
  const relativeDate = dayjs(date).format("D MMMM YYYY");

  if (dayjs(date).isToday()) {
    return (
      <Text className="text-typography-500">{`ของวันนี้ (${relativeDate})`}</Text>
    );
  }

  if (dayjs(date).isYesterday()) {
    return (
      <Text className="text-tertiary-500">{`⚠️ ของเมื่อวาน (${relativeDate})`}</Text>
    );
  }

  return (
    <Text className="text-tertiary-500">{`⚠️ ของวันที่ ${relativeDate}`}</Text>
  );
}

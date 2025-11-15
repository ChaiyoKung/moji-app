import { useState } from "react";
import { useSettingStore } from "../../stores/use-setting-store";
import { Calendar } from "react-native-calendars";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import colors from "tailwindcss/colors";
import { getTransactionIdsByDate } from "../../libs/api";
import { getMarkedDates } from "../../utils/calendar-marking";

export interface TransactionCalendarProps {
  /**
   * The currently selected date in "YYYY-MM-DD" format.
   */
  selectedDate: string;

  /**
   * Callback invoked when the selected date changes. Receives the new date in "YYYY-MM-DD" format.
   */
  onSelectedDateChange: (date: string) => void;

  /**
   * Today's date in "YYYY-MM-DD" format. Used to limit selection and highlight today.
   */
  todayDate: string;
}

export function TransactionCalendar({
  selectedDate,
  onSelectedDateChange,
  todayDate,
}: TransactionCalendarProps) {
  const isCalendarSwipeMonthsEnabled = useSettingStore(
    (state) => state.isCalendarSwipeMonthsEnabled
  );

  const [currentMonth, setCurrentMonth] = useState(
    dayjs(selectedDate).format("YYYY-MM")
  );

  const startOfMonth = dayjs(currentMonth + "-01")
    .startOf("month")
    .format("YYYY-MM-DD");
  const endOfMonth = dayjs(currentMonth + "-01")
    .endOf("month")
    .format("YYYY-MM-DD");

  const transactionIdsByDateQuery = useQuery({
    queryKey: ["transactionIdsByDate", startOfMonth, endOfMonth],
    queryFn: () =>
      getTransactionIdsByDate({
        startDate: startOfMonth,
        endDate: endOfMonth,
        timezone: dayjs.tz.guess(),
      }),
  });

  const markedDates = getMarkedDates(
    transactionIdsByDateQuery.data ?? [],
    selectedDate
  );

  return (
    <Calendar
      onDayPress={(day) => onSelectedDateChange(day.dateString)}
      onMonthChange={(month) =>
        setCurrentMonth(dayjs(month.dateString).format("YYYY-MM"))
      }
      current={selectedDate}
      maxDate={todayDate}
      enableSwipeMonths={isCalendarSwipeMonthsEnabled}
      displayLoadingIndicator={transactionIdsByDateQuery.isLoading}
      markedDates={markedDates}
      markingType="multi-dot"
      theme={{
        calendarBackground: colors.transparent,
        arrowColor: colors.zinc[500],
        monthTextColor: colors.zinc[800],
        dayTextColor: colors.zinc[800],
        selectedDayBackgroundColor: colors.blue[500],
        selectedDayTextColor: colors.white,
        todayTextColor: colors.blue[500],
        textDisabledColor: colors.zinc[300],
        textSectionTitleColor: colors.zinc[500],
        textDayFontFamily: "Prompt",
        textMonthFontFamily: "Prompt",
        todayButtonFontFamily: "Prompt",
        textDayHeaderFontFamily: "Prompt",
        textDayFontWeight: "400",
        textMonthFontWeight: "400",
        todayButtonFontWeight: "400",
        textDayHeaderFontWeight: "400",
      }}
    />
  );
}

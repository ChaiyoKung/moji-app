import colors from "tailwindcss/colors";

/**
 * Build markedDates object for react-native-calendars Calendar.
 * @param transactionDates - Record of date string to array of transaction IDs
 * @param selectedDate - Currently selected date string
 */
export function getMarkedDates(
  transactionDates: Record<string, string[]>,
  selectedDate: string
) {
  const marked: Record<string, any> = {};

  Object.entries(transactionDates).forEach(([date, ids]) => {
    marked[date] = {
      dots: ids.map((id) => ({
        key: id,
        color: date === selectedDate ? colors.white : colors.blue[500],
      })),
    };
  });

  marked[selectedDate] = {
    ...(marked[selectedDate] || {}),
    selected: true,
    selectedColor: colors.blue[500],
    selectedTextColor: colors.white,
  };

  return marked;
}

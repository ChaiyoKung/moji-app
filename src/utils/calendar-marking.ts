import colors from "tailwindcss/colors";

/**
 * Build markedDates object for react-native-calendars Calendar.
 * @param transactionIdsByDate - Array of {_id: date string, ids: string[]}
 * @param selectedDate - Currently selected date string
 */
export function getMarkedDates(
  transactionIdsByDate: { _id: string; ids: string[] }[],
  selectedDate: string
) {
  const marked: Record<string, any> = {};

  transactionIdsByDate.forEach(({ _id: date, ids }) => {
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

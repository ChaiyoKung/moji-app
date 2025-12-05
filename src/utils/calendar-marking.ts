import colors from "tailwindcss/colors";

/**
 * Get dot color based on transaction count and selection state
 * @param count - Number of transactions
 * @param isSelected - Whether the date is selected
 */
function getDotColor(count: number, isSelected: boolean): string {
  if (isSelected) {
    // For selected days: more items = lighter blue/white
    if (count <= 2) return colors.blue[300];
    if (count <= 5) return colors.blue[100];
    return colors.blue[50];
  } else {
    // For non-selected days: more items = darker blue
    if (count <= 2) return colors.blue[300];
    if (count <= 5) return colors.blue[500];
    return colors.blue[700];
  }
}

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

  for (const item of transactionIdsByDate) {
    const { _id: date, ids } = item;

    const count = ids.length;
    const isSelected = date === selectedDate;

    marked[date] = {
      dots: [
        {
          key: `dot-${date}`,
          color: getDotColor(count, isSelected),
        },
      ],
    };
  }

  marked[selectedDate] = {
    ...(marked[selectedDate] || {}),
    selected: true,
    selectedColor: colors.blue[500],
    selectedTextColor: colors.white,
  };

  return marked;
}

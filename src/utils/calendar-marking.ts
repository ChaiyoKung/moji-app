import colors from "tailwindcss/colors";

/**
 * Get dot color based on transaction count and selection state
 * @param color - Tailwind color object
 * @param count - Number of transactions
 * @param isSelected - Whether the date is selected
 */
function getDotColor(
  color: {
    50: string;
    100: string;
    300: string;
    500: string;
    700: string;
  },
  count: number,
  isSelected: boolean
): string {
  if (isSelected) {
    // For selected days: more items = lighter blue/white
    if (count <= 2) return color[300];
    if (count <= 5) return color[100];
    return color[50];
  } else {
    // For non-selected days: more items = darker blue
    if (count <= 2) return color[300];
    if (count <= 5) return color[500];
    return color[700];
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
          color: getDotColor(colors.blue, count, isSelected),
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

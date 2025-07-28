import colors from "tailwindcss/colors";
import { getMarkedDates } from "./calendar-marking";

describe("getMarkedDates", () => {
  it("should return correct markedDates for given transactionDates and selectedDate", () => {
    const mockTransactionDates = [
      { _id: "2025-06-19", ids: ["id1", "id2"] },
      { _id: "2025-06-20", ids: ["id3"] },
    ];
    const selectedDate = "2025-06-19";
    const result = getMarkedDates(mockTransactionDates, selectedDate);

    // Selected date (2025-06-19) with 2 items should have single gray dot
    expect(result["2025-06-19"].dots).toHaveLength(1);
    expect(result["2025-06-19"].dots[0].key).toBe("dot-2025-06-19");
    expect(result["2025-06-19"].dots[0].color).toBe(colors.gray[500]); // for 2 items on selected date
    expect(result["2025-06-19"].selected).toBe(true);
    expect(result["2025-06-19"].selectedColor).toBeDefined();
    expect(result["2025-06-19"].selectedTextColor).toBeDefined();

    // Non-selected date (2025-06-20) with 1 item should have single blue dot
    expect(result["2025-06-20"].dots).toHaveLength(1);
    expect(result["2025-06-20"].dots[0].key).toBe("dot-2025-06-20");
    expect(result["2025-06-20"].dots[0].color).toBe(colors.blue[300]); // for 1 item on non-selected date
    expect(result["2025-06-20"].selected).toBeUndefined();

    // If selectedDate is not in transactionDates, it should still be marked as selected
    const result2 = getMarkedDates(mockTransactionDates, "2025-06-21");
    expect(result2["2025-06-21"].selected).toBe(true);
    expect(result2["2025-06-21"].dots).toBeUndefined();
  });

  it("should apply correct color intensity based on transaction count", () => {
    const mockTransactionDates = [
      { _id: "2025-06-01", ids: ["id1"] }, // 1 item
      { _id: "2025-06-02", ids: ["id1", "id2", "id3"] }, // 3 items
      {
        _id: "2025-06-03",
        ids: ["id1", "id2", "id3", "id4", "id5", "id6", "id7"],
      }, // 7 items
    ];
    const selectedDate = "2025-06-02";
    const result = getMarkedDates(mockTransactionDates, selectedDate);

    // 1 item, non-selected: light blue
    expect(result["2025-06-01"].dots[0].color).toBe(colors.blue[300]);

    // 3 items, selected: light gray
    expect(result["2025-06-02"].dots[0].color).toBe(colors.gray[300]);

    // 7 items, non-selected: dark blue
    expect(result["2025-06-03"].dots[0].color).toBe(colors.blue[700]);
  });
});

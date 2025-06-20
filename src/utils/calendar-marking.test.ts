import { getMarkedDates } from "./calendar-marking";

describe("getMarkedDates", () => {
  it("should return correct markedDates for given transactionDates and selectedDate", () => {
    const mockTransactionDates = {
      "2025-06-19": ["id1", "id2"],
      "2025-06-20": ["id3"],
    };
    const selectedDate = "2025-06-19";
    const result = getMarkedDates(mockTransactionDates, selectedDate);

    expect(result["2025-06-19"].dots).toHaveLength(2);
    expect(result["2025-06-19"].dots[0].key).toBe("id1");
    expect(result["2025-06-19"].dots[1].key).toBe("id2");
    expect(result["2025-06-19"].selected).toBe(true);
    expect(result["2025-06-19"].selectedColor).toBeDefined();
    expect(result["2025-06-19"].selectedTextColor).toBeDefined();

    expect(result["2025-06-20"].dots).toHaveLength(1);
    expect(result["2025-06-20"].dots[0].key).toBe("id3");
    expect(result["2025-06-20"].selected).toBeUndefined();

    // If selectedDate is not in transactionDates, it should still be marked as selected
    const result2 = getMarkedDates(mockTransactionDates, "2025-06-21");
    expect(result2["2025-06-21"].selected).toBe(true);
    expect(result2["2025-06-21"].dots).toBeUndefined();
  });
});

import colors from "tailwindcss/colors";
import { getDotColor, getMarkedDates } from "./calendar-marking";

describe("getDotColor", () => {
  const mockColor = {
    50: "#eff6ff",
    100: "#dbeafe",
    300: "#93c5fd",
    500: "#3b82f6",
    700: "#1d4ed8",
  };

  describe("when date is selected (isSelected = true)", () => {
    it("should return color[300] for count <= 2 (count = 0)", () => {
      expect(getDotColor(mockColor, 0, true)).toBe(mockColor[300]);
    });

    it("should return color[300] for count <= 2 (count = 1)", () => {
      expect(getDotColor(mockColor, 1, true)).toBe(mockColor[300]);
    });

    it("should return color[300] for count <= 2 (count = 2)", () => {
      expect(getDotColor(mockColor, 2, true)).toBe(mockColor[300]);
    });

    it("should return color[100] for count 3-5 (count = 3)", () => {
      expect(getDotColor(mockColor, 3, true)).toBe(mockColor[100]);
    });

    it("should return color[100] for count 3-5 (count = 4)", () => {
      expect(getDotColor(mockColor, 4, true)).toBe(mockColor[100]);
    });

    it("should return color[100] for count 3-5 (count = 5)", () => {
      expect(getDotColor(mockColor, 5, true)).toBe(mockColor[100]);
    });

    it("should return color[50] for count > 5 (count = 6)", () => {
      expect(getDotColor(mockColor, 6, true)).toBe(mockColor[50]);
    });

    it("should return color[50] for count > 5 (count = 10)", () => {
      expect(getDotColor(mockColor, 10, true)).toBe(mockColor[50]);
    });

    it("should return color[50] for count > 5 (count = 100)", () => {
      expect(getDotColor(mockColor, 100, true)).toBe(mockColor[50]);
    });
  });

  describe("when date is not selected (isSelected = false)", () => {
    it("should return color[300] for count <= 2 (count = 0)", () => {
      expect(getDotColor(mockColor, 0, false)).toBe(mockColor[300]);
    });

    it("should return color[300] for count <= 2 (count = 1)", () => {
      expect(getDotColor(mockColor, 1, false)).toBe(mockColor[300]);
    });

    it("should return color[300] for count <= 2 (count = 2)", () => {
      expect(getDotColor(mockColor, 2, false)).toBe(mockColor[300]);
    });

    it("should return color[500] for count 3-5 (count = 3)", () => {
      expect(getDotColor(mockColor, 3, false)).toBe(mockColor[500]);
    });

    it("should return color[500] for count 3-5 (count = 4)", () => {
      expect(getDotColor(mockColor, 4, false)).toBe(mockColor[500]);
    });

    it("should return color[500] for count 3-5 (count = 5)", () => {
      expect(getDotColor(mockColor, 5, false)).toBe(mockColor[500]);
    });

    it("should return color[700] for count > 5 (count = 6)", () => {
      expect(getDotColor(mockColor, 6, false)).toBe(mockColor[700]);
    });

    it("should return color[700] for count > 5 (count = 10)", () => {
      expect(getDotColor(mockColor, 10, false)).toBe(mockColor[700]);
    });

    it("should return color[700] for count > 5 (count = 100)", () => {
      expect(getDotColor(mockColor, 100, false)).toBe(mockColor[700]);
    });
  });

  describe("integration with Tailwind colors", () => {
    it("should work with actual Tailwind blue colors for selected dates", () => {
      expect(getDotColor(colors.blue, 2, true)).toBe(colors.blue[300]);
      expect(getDotColor(colors.blue, 4, true)).toBe(colors.blue[100]);
      expect(getDotColor(colors.blue, 8, true)).toBe(colors.blue[50]);
    });

    it("should work with actual Tailwind blue colors for non-selected dates", () => {
      expect(getDotColor(colors.blue, 2, false)).toBe(colors.blue[300]);
      expect(getDotColor(colors.blue, 4, false)).toBe(colors.blue[500]);
      expect(getDotColor(colors.blue, 8, false)).toBe(colors.blue[700]);
    });
  });
});

describe("getMarkedDates", () => {
  it("should return correct markedDates for given transactionDates and selectedDate", () => {
    const mockTransactionDates = [
      { _id: "2025-06-19", ids: ["id1", "id2"] },
      { _id: "2025-06-20", ids: ["id3"] },
    ];
    const selectedDate = "2025-06-19";
    const result = getMarkedDates(mockTransactionDates, selectedDate);

    // Selected date (2025-06-19) with 2 items should have single blue[300] dot
    expect(result["2025-06-19"].dots).toHaveLength(1);
    expect(result["2025-06-19"].dots[0].key).toBe("dot-2025-06-19");
    expect(result["2025-06-19"].dots[0].color).toBe(colors.blue[300]); // for 2 items on selected date
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

  it("should use blue[300] for selected date with <=2 items", () => {
    const result = getMarkedDates(
      [{ _id: "2025-07-01", ids: ["a", "b"] }],
      "2025-07-01"
    );
    expect(result["2025-07-01"].dots[0].color).toBe(colors.blue[300]);
  });

  it("should use blue[100] for selected date with 3-5 items", () => {
    const result = getMarkedDates(
      [{ _id: "2025-07-02", ids: ["a", "b", "c", "d"] }],
      "2025-07-02"
    );
    expect(result["2025-07-02"].dots[0].color).toBe(colors.blue[100]);
  });

  it("should use blue[50] for selected date with >5 items", () => {
    const result = getMarkedDates(
      [{ _id: "2025-07-03", ids: ["a", "b", "c", "d", "e", "f"] }],
      "2025-07-03"
    );
    expect(result["2025-07-03"].dots[0].color).toBe(colors.blue[50]);
  });

  it("should use blue[300] for non-selected date with <=2 items", () => {
    const result = getMarkedDates(
      [{ _id: "2025-07-04", ids: ["a", "b"] }],
      "2025-07-99"
    );
    expect(result["2025-07-04"].dots[0].color).toBe(colors.blue[300]);
  });

  it("should use blue[500] for non-selected date with 3-5 items", () => {
    const result = getMarkedDates(
      [{ _id: "2025-07-05", ids: ["a", "b", "c", "d", "e"] }],
      "2025-07-99"
    );
    expect(result["2025-07-05"].dots[0].color).toBe(colors.blue[500]);
  });

  it("should use blue[700] for non-selected date with >5 items", () => {
    const result = getMarkedDates(
      [{ _id: "2025-07-06", ids: ["a", "b", "c", "d", "e", "f", "g"] }],
      "2025-07-99"
    );
    expect(result["2025-07-06"].dots[0].color).toBe(colors.blue[700]);
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

    // 3 items, selected: blue[100]
    expect(result["2025-06-02"].dots[0].color).toBe(colors.blue[100]);

    // 7 items, non-selected: dark blue
    expect(result["2025-06-03"].dots[0].color).toBe(colors.blue[700]);
  });
});

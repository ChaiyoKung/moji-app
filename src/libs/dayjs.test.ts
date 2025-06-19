import dayjs from "dayjs";
import { nowDate } from "./dayjs";

jest.mock("dayjs");

describe("nowDate", () => {
  it("returns the current date in YYYY-MM-DD format", () => {
    // Mock dayjs to return a fixed date
    const mockFormat = jest.fn().mockReturnValue("2025-06-19");
    (dayjs as unknown as jest.Mock).mockReturnValue({ format: mockFormat });

    expect(nowDate()).toBe("2025-06-19");
    expect(mockFormat).toHaveBeenCalledWith("YYYY-MM-DD");
  });
});

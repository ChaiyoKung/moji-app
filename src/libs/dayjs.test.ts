import dayjs from "dayjs";
import { nowDate, fromNowDate } from "./dayjs";

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

describe("fromNowDate", () => {
  it('returns "วันนี้" if the date is today', () => {
    const mockIsToday = jest.fn().mockReturnValue(true);
    const mockIsYesterday = jest.fn().mockReturnValue(false);
    const mockFormat = jest.fn();

    (dayjs as unknown as jest.Mock).mockReturnValue({
      isToday: mockIsToday,
      isYesterday: mockIsYesterday,
      format: mockFormat,
    });

    expect(fromNowDate("2025-06-19")).toBe("วันนี้");
    expect(mockIsToday).toHaveBeenCalled();
    expect(mockIsYesterday).not.toHaveBeenCalled();
    expect(mockFormat).not.toHaveBeenCalled();
  });

  it('returns "เมื่อวาน" if the date is yesterday', () => {
    const mockIsToday = jest.fn().mockReturnValue(false);
    const mockIsYesterday = jest.fn().mockReturnValue(true);
    const mockFormat = jest.fn();

    (dayjs as unknown as jest.Mock).mockReturnValue({
      isToday: mockIsToday,
      isYesterday: mockIsYesterday,
      format: mockFormat,
    });

    expect(fromNowDate("2025-06-18")).toBe("เมื่อวาน");
    expect(mockIsToday).toHaveBeenCalled();
    expect(mockIsYesterday).toHaveBeenCalled();
    expect(mockFormat).not.toHaveBeenCalled();
  });

  it("returns formatted date if not today or yesterday", () => {
    const mockIsToday = jest.fn().mockReturnValue(false);
    const mockIsYesterday = jest.fn().mockReturnValue(false);
    const mockFormat = jest.fn().mockReturnValue("17 มิถุนายน 2025");

    (dayjs as unknown as jest.Mock).mockReturnValue({
      isToday: mockIsToday,
      isYesterday: mockIsYesterday,
      format: mockFormat,
    });

    expect(fromNowDate("2025-06-17")).toBe("17 มิถุนายน 2025");
    expect(mockIsToday).toHaveBeenCalled();
    expect(mockIsYesterday).toHaveBeenCalled();
    expect(mockFormat).toHaveBeenCalledWith("D MMMM YYYY");
  });
});

import { arrayFill } from "./array";

describe("arrayFill", () => {
  it("fills array with primitive values", () => {
    expect(arrayFill(3, 5)).toEqual([5, 5, 5]);
    expect(arrayFill(4, "a")).toEqual(["a", "a", "a", "a"]);
  });

  it("fills array with object references", () => {
    const obj = { a: 1 };
    const result = arrayFill(2, obj);
    expect(result).toEqual([obj, obj]);
    expect(result[0]).toBe(result[1]);
  });

  it("returns empty array for length 0", () => {
    expect(arrayFill(0, 123)).toEqual([]);
  });

  it("returns empty array for negative length", () => {
    expect(arrayFill(-5, "x")).toEqual([]);
  });
});

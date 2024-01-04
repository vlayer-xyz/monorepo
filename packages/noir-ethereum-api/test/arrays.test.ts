import { describe, expect, it } from "vitest";
import { padArrayRight } from "../src/arrays.js";

describe('arrays', () => {
  it('padArrayRight', () => {
    expect(padArrayRight([], 0, "a")).toEqual([])
    expect(padArrayRight([], 3, "a")).toEqual(["a", "a", "a"])
    expect(padArrayRight(['b'], 3, "a")).toEqual(["b", "a", "a"])
    expect(padArrayRight(['0x01'], 4, "0x00")).toEqual(["0x01", "0x00", "0x00", "0x00"])
  })

  it('padArrayRight invalid len', () => {
    expect(() => padArrayRight(["a"], 0, "a")).toThrow("len param: 0 should be greater than array length: 1")
  })
})

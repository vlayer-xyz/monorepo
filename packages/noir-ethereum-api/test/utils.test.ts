import { describe, expect, it } from "vitest";
import { isHexString } from "../src/utils.js";

describe('utils', () => {
  it('test isHexString', () => {
    expect(isHexString('0x00')).toEqual(true);
    expect(isHexString('0xff')).toEqual(true);
    expect(isHexString('0x1234567890abcdef')).toEqual(true);
    expect(isHexString('0x1')).toEqual(true);
    expect(isHexString('0xfffffffffffffffffffffffffffffffff')).toEqual(true);
    expect(isHexString('123')).toEqual(true);
    expect(isHexString('abc')).toEqual(true);

    expect(isHexString('0xg')).toEqual(false);
    expect(isHexString('0x')).toEqual(false);
    expect(isHexString('abcdefg')).toEqual(false);
    expect(isHexString('')).toEqual(false);
    expect(isHexString('')).toEqual(false);
  })
})
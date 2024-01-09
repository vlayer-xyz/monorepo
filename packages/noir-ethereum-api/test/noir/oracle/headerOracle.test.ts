import { describe, expect, it } from "vitest";
import { parseArguments } from "../../../src/noir/oracles/headerOracle.js";

describe('headerOracle', () => {
  it('parseArguments success', () => {
    expect(parseArguments([['0x0']])).toEqual(0n)
    expect(parseArguments([['0xff']])).toEqual(255n)
  })

  it('parseArguments fail', () => {
    expect(() => parseArguments([])).toThrow('get_header requires 1 argument')
    expect(() => parseArguments([[],[]])).toThrow('get_header requires 1 argument')
    expect(() => parseArguments([[]])).toThrow('get_account first argument must be an array of length 1')
    expect(() => parseArguments([['1']])).toThrow('get_account first argument must be a hex value')
  })
})
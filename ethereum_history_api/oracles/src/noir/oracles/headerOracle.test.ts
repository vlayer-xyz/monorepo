import { describe, expect, it } from 'vitest';
import { decodeHeaderArgs } from './headerOracle.js';

describe('headerOracle', () => {
  it('decodeGetHeaderArguments success', () => {
    expect(decodeHeaderArgs([['0x0']])).toEqual(0n);
    expect(decodeHeaderArgs([['0xff']])).toEqual(255n);
  });

  it('decodeGetHeaderArguments fail', () => {
    expect(() => decodeHeaderArgs([])).toThrow('get_header requires 1 argument');
    expect(() => decodeHeaderArgs([[], []])).toThrow('get_header requires 1 argument');
    expect(() => decodeHeaderArgs([[]])).toThrow('get_account first argument must be an array of length 1');
    expect(() => decodeHeaderArgs([['1']])).toThrow('get_account first argument must be a hex value');
  });
});

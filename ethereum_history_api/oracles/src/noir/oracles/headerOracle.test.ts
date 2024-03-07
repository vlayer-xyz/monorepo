import { describe, expect, it } from 'vitest';
import { decodeGetHeaderArguments } from './headerOracle.js';

describe('headerOracle', () => {
  it('decodeGetHeaderArguments success', () => {
    expect(decodeGetHeaderArguments([['0x0']])).toEqual(0n);
    expect(decodeGetHeaderArguments([['0xff']])).toEqual(255n);
  });

  it('decodeGetHeaderArguments fail', () => {
    expect(() => decodeGetHeaderArguments([])).toThrow('get_header requires 1 argument');
    expect(() => decodeGetHeaderArguments([[], []])).toThrow('get_header requires 1 argument');
    expect(() => decodeGetHeaderArguments([[]])).toThrow('get_account first argument must be an array of length 1');
    expect(() => decodeGetHeaderArguments([['1']])).toThrow('get_account first argument must be a hex value');
  });
});

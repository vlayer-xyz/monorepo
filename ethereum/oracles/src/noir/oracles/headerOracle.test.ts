import { describe, expect, it } from 'vitest';
import { decodeGetHeaderArguments } from './headerOracle.js';
import { mainnet } from 'viem/chains';

describe('headerOracle', () => {
  it('decodeGetHeaderArguments success', () => {
    expect(decodeGetHeaderArguments([['0x1'], ['0x0']])).toEqual({ chainId: mainnet.id, blockNumber: 0n });
    expect(decodeGetHeaderArguments([['0x1'], ['0xff']])).toEqual({ chainId: mainnet.id, blockNumber: 255n });
  });

  it('decodeGetHeaderArguments fail', () => {
    expect(() => decodeGetHeaderArguments([])).toThrow('get_header requires 2 argument');
    expect(() => decodeGetHeaderArguments([[], [], []])).toThrow('get_header requires 2 argument');
    expect(() => decodeGetHeaderArguments([['0x01'], []])).toThrow('blockNumber should be a single value');
    expect(() => decodeGetHeaderArguments([['1'], ['0xff']])).toThrow('Field elements should be hexes: 1');
  });
});

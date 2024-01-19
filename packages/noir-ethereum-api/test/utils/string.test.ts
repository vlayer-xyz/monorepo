import { describe, expect, it } from 'vitest';
import { incHexStr } from '../../src/utils/string.js';

describe('incHexStr', () => {
  it('zero', () => {
    expect(incHexStr('0x0')).toEqual('0x1');
  });

  it('small', () => {
    expect(incHexStr('0x10')).toEqual('0x11');
  });

  it('big', () => {
    expect(incHexStr('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1')).toEqual(
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff2'
    );
  });
});

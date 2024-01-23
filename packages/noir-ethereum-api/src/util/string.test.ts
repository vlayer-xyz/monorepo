import { describe, expect, it } from 'vitest';
import { incHexByte, incHexStr } from './string.js';

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

describe('incHexByte', () => {
  it('zero', () => {
    expect(incHexByte('0x0')).toEqual('0x1');
  });

  it('mid size', () => {
    expect(incHexByte('0xaa')).toEqual('0xab');
    expect(incHexByte('0xAA')).toEqual('0xab');
  });

  it('oveflow', () => {
    expect(incHexByte('0xFF')).toEqual('0x0');
  });
});

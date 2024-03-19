import { describe, expect, it } from 'vitest';
import { decodeHexString, encodeHexString, encodeHexStringToArray } from './encode.js';

describe('encodeHexStringToArray', () => {
  it('throws on invalid input', () => {
    expect(() => encodeHexStringToArray('1234')).toThrow('Invalid hexstring: 1234');
  });
  it('encodes hex string to array', () => {
    expect(encodeHexStringToArray('0x1234')).toStrictEqual(new Uint8Array([0x12, 0x34]));
  });
});

describe('encodeHexString', () => {
  it('encodes hex string', () => {
    expect(encodeHexString('0x000123')).toStrictEqual(['0x00', '0x01', '0x23']);
  });
});

describe('decodeHexString', () => {
  it('decodes hex string', () => {
    expect(decodeHexString(new Uint8Array([0x12, 0x34]))).toStrictEqual('0x1234');
  });
});

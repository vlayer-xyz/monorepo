import { describe, expect, it } from 'vitest';
import { decodeHexString, encodeHexString, encodeHexStringToArray, encodeNullable, joinArray } from './encode.js';

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

describe('encodeNullable', () => {
  it('encodes nullable', () => {
    expect(encodeNullable('0x1234')).toBe('Option::some(0x1234)');
    expect(encodeNullable(null)).toBe('Option::none()');
  });
});

describe('formatArray', () => {
  it('formats array', () => {
    const expectedFormattedArray = `[
    0x12,0x34
  ]`;
    expect(joinArray(['0x12', '0x34'])).toBe(expectedFormattedArray);
  });
});

describe('decodeHexString', () => {
  it('decodes hex string', () => {
    expect(decodeHexString(new Uint8Array([0x12, 0x34]))).toStrictEqual('0x1234');
  });
});

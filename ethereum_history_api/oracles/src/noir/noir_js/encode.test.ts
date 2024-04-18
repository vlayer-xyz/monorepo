import { describe, expect, it } from 'vitest';
import {
  decodeHexString,
  encodeHexString,
  encodeHexStringToArray,
  encodeOptional,
  joinArray,
  indentLine,
  indentBlock,
  joinArrayVertical
} from './encode.js';

describe('encodeHexStringToArray', () => {
  it('throws on invalid input', () => {
    expect(() => encodeHexStringToArray('1234')).toThrow('Invalid hex string: 1234');
  });
  it('encodes hex string to array', () => {
    expect(encodeHexStringToArray('0x1234')).toStrictEqual(new Uint8Array([0x12, 0x34]));
  });
  it('encodes odd hex string to array', () => {
    expect(encodeHexStringToArray('0x123')).toStrictEqual(new Uint8Array([0x01, 0x23]));
  });
});

describe('encodeHexString', () => {
  it('encodes hex string', () => {
    expect(encodeHexString('0x000123')).toStrictEqual(['0x00', '0x01', '0x23']);
  });
});

describe('encodeOptional', () => {
  it('encodes optional', () => {
    expect(encodeOptional('0x1234')).toBe('Option::some(0x1234)');
    expect(encodeOptional(null)).toBe('Option::none()');
  });
});

describe('joinArray', () => {
  it('joins array', () => {
    const expectedFormattedArray = `[
  0x12, 0x34
]`;
    expect(joinArray(['0x12', '0x34'])).toBe(expectedFormattedArray);
  });
});

describe('joinArrayVertical', () => {
  it('empty', () => {
    const expectedFormattedArray = `[

]`;
    expect(joinArrayVertical([])).toBe(expectedFormattedArray);
  });
  it('non-empty', () => {
    const expectedFormattedArray = `[
  [],
  []
]`;
    expect(joinArrayVertical(['[]', '[]'])).toBe(expectedFormattedArray);
  });
});

describe('indentLine', () => {
  it('tabulates line', () => {
    expect(indentLine('line', 2)).toBe('    line');
  });
});

describe('indentBlock', () => {
  it('tabulates struct field', () => {
    const value = '[\n  1\n]';
    expect(indentBlock(value, 0)).toStrictEqual(`[
  1
]`);
    expect(indentBlock(value, 1)).toStrictEqual(`[
    1
  ]`);
  });

  it('tabulates multiline array element', () => {
    const value = '[\n  1\n]';
    expect(indentBlock(value, 0, false)).toStrictEqual(`[
  1
]`);
    expect(indentBlock(value, 1, false)).toStrictEqual(`  [
    1
  ]`);
  });
});

describe('decodeHexString', () => {
  it('decodes hex string', () => {
    expect(decodeHexString(new Uint8Array([0x12, 0x34]))).toStrictEqual('0x1234');
  });
});

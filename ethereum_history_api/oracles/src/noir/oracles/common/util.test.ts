import { describe, expect, it } from 'vitest';
import { RLP_SHORT_ENTITY_MAX_LEN, getRlpEncodedSize, getRlpHeaderSize } from './util.js';
import { ADDRESS_LEN, BYTES32_LEN } from './const.js';

describe('getRlpHeaderSize', () => {
  it('should return 1 for short strings', () => {
    expect(getRlpHeaderSize(0)).toBe(1);
    expect(getRlpHeaderSize(1)).toBe(1);
    expect(getRlpHeaderSize(ADDRESS_LEN)).toBe(1);
    expect(getRlpHeaderSize(BYTES32_LEN)).toBe(1);
    expect(getRlpHeaderSize(RLP_SHORT_ENTITY_MAX_LEN)).toBe(1);
  });

  it('should return 2 for long strings where length len is 1', () => {
    expect(getRlpHeaderSize(RLP_SHORT_ENTITY_MAX_LEN + 1)).toBe(2);
    expect(getRlpHeaderSize(2 ** 8 - 1)).toBe(2);
  });

  it('should return 3 for long strings where length len is 2', () => {
    expect(getRlpHeaderSize(256)).toBe(3);
    expect(getRlpHeaderSize(512)).toBe(3);
    expect(getRlpHeaderSize(2 ** 16 - 1)).toBe(3);
  });

  it('should return 4 for long strings where length len is 3', () => {
    expect(getRlpHeaderSize(2 ** 16)).toBe(4);
    expect(getRlpHeaderSize(100_000)).toBe(4);
  });

  it('should return 5 for long strings where length len is 4', () => {
    expect(getRlpHeaderSize(100_000_000)).toBe(5);
  });
});

describe('getRlpEncodedSize', () => {
  it('should return correct size', () => {
    expect(getRlpEncodedSize(1)).toBe(2);
    expect(getRlpEncodedSize(ADDRESS_LEN)).toBe(1 + ADDRESS_LEN);
    expect(getRlpEncodedSize(100_000_000)).toBe(5 + 100_000_000);
  });
});

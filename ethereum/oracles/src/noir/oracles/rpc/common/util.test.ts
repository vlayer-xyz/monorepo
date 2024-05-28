import { describe, expect, it } from 'vitest';
import { RLP_SHORT_ENTITY_MAX_LEN, getMaxRlpEncodedSize, getMaxRlpHeaderSize } from './util.js';
import { ADDRESS_LEN, BYTES32_LEN } from '../../common/const.js';

describe('getRlpHeaderSize', () => {
  it('should return 1 for short entities', () => {
    expect(getMaxRlpHeaderSize(0)).toBe(1);
    expect(getMaxRlpHeaderSize(1)).toBe(1);
    expect(getMaxRlpHeaderSize(ADDRESS_LEN)).toBe(1);
    expect(getMaxRlpHeaderSize(BYTES32_LEN)).toBe(1);
    expect(getMaxRlpHeaderSize(RLP_SHORT_ENTITY_MAX_LEN)).toBe(1);
  });

  it('should return 2 for long entities where length len is 1', () => {
    expect(getMaxRlpHeaderSize(RLP_SHORT_ENTITY_MAX_LEN + 1)).toBe(2);
    expect(getMaxRlpHeaderSize(2 ** 8 - 1)).toBe(2);
  });

  it('should return 3 for long entities where length len is 2', () => {
    expect(getMaxRlpHeaderSize(256)).toBe(3);
    expect(getMaxRlpHeaderSize(512)).toBe(3);
    expect(getMaxRlpHeaderSize(2 ** 16 - 1)).toBe(3);
  });

  it('should return 4 for long entities where length len is 3', () => {
    expect(getMaxRlpHeaderSize(2 ** 16)).toBe(4);
    expect(getMaxRlpHeaderSize(100_000)).toBe(4);
  });

  it('should return 5 for long entities where length len is 4', () => {
    expect(getMaxRlpHeaderSize(100_000_000)).toBe(5);
  });
});

describe('getRlpEncodedSize', () => {
  it('should return correct size', () => {
    expect(getMaxRlpEncodedSize(1)).toBe(2);
    expect(getMaxRlpEncodedSize(ADDRESS_LEN)).toBe(1 + ADDRESS_LEN);
    expect(getMaxRlpEncodedSize(100_000_000)).toBe(5 + 100_000_000);
  });
});

import { describe, expect, it } from 'vitest';
import {
  encodeAddress,
  encodeByte,
  encodeBytes32,
  encodeField,
  encodeHex,
  encodeProofNode,
  encodeU128
} from './encode.js';
import { MODULUS } from './const.js';

describe('encodeByte', () => {
  it('should throw an error for byte overflow', () => {
    expect(() => encodeByte(256)).toThrow('Byte overflow');
  });

  it('should throw an error for byte underflow', () => {
    expect(() => encodeByte(-1)).toThrow('Byte underflow');
  });

  it('should return "0x00" for zero', () => {
    expect(encodeByte(0)).toBe('0x00');
  });

  it('one nibble', () => {
    expect(encodeByte(15)).toBe('0x0f');
  });

  it('two nibbles', () => {
    expect(encodeByte(255)).toBe('0xff');
  });
});

describe('encodeField', () => {
  it('should throw an error for field overflow', () => {
    expect(() => encodeField(MODULUS)).toThrow('Field overflow');
  });

  it('should throw an error for field underflow', () => {
    expect(() => encodeField(-1)).toThrow('Field underflow');
  });

  it('should return "0x" for zero', () => {
    expect(encodeField(0)).toBe('0x');
  });

  it('should handle even hex values correctly', () => {
    expect(encodeField(1)).toBe('0x01');
  });

  it('should handle odd values correctly', () => {
    expect(encodeField(128)).toBe('0x80');
  });

  it('should handle large values correctly', () => {
    expect(encodeField(100500)).toBe('0x018894');
  });
});

describe('encodeU128', () => {
  it('should encode 1 correctly', () => {
    expect(encodeU128(1n)).toStrictEqual(['0x', '0x01']);
  });
  it('should encode 255 correctly', () => {
    expect(encodeU128(255n)).toStrictEqual(['0x', '0xff']);
  });
  it('should encode large values correctly', () => {
    expect(encodeU128(100500n)).toStrictEqual(['0x', '0x018894']);
  });
  it('should encode values over 64 bits correctly', () => {
    expect(encodeU128(2n ** 64n)).toStrictEqual(['0x01', '0x']);
  });
});

describe('encodeHex', () => {
  it('small values should be padded', () => {
    expect(encodeHex('0x1')).toStrictEqual(['0x01']);
  });

  it('values should be padded', () => {
    expect(encodeHex('0x123')).toStrictEqual(['0x01', '0x23']);
  });

  it('invalid hex string', () => {
    expect(() => encodeHex('0xg')).toThrow('Invalid hex string: 0xg');
  });
});

describe('encodeBytes32', () => {
  it('zero', () => {
    // prettier-ignore
    expect(encodeBytes32(0n)).toStrictEqual([
      '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00',
      '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00'
    ]);
  });

  it('one', () => {
    // prettier-ignore
    expect(encodeBytes32(1n)).toStrictEqual([
      '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00',
      '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x01'
    ]);
  });

  it('4 bytes number', () => {
    // prettier-ignore
    expect(encodeBytes32(3000000019n)).toStrictEqual([
      '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00',
      '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0xb2', '0xd0', '0x5e', '0x13'
    ]);
  });

  it('MAX_INT_256', () => {
    // prettier-ignore
    expect(encodeBytes32(2n ** 256n - 1n)).toStrictEqual([
      '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff',
      '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff', '0xff',
      '0xff', '0xff', '0xff', '0xff'
    ]);
  });

  it('throws if negative value', () => {
    expect(() => encodeBytes32(-1n)).toThrow('Invalid Bytes32: Negative');
  });

  it('throws if overflows', () => {
    expect(() => encodeBytes32(2n ** 256n)).toThrow('Invalid Bytes32: Overflow');
  });
});

describe('encodeAddress', () => {
  it('simple', () => {
    // prettier-ignore
    expect(encodeAddress('0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb')).toStrictEqual([
      '0xb4', '0x7e', '0x3c', '0xd8', '0x37', '0xdd', '0xf8', '0xe4', '0xc5', '0x7f', '0x05', '0xd7', '0x0a', '0xb8',
      '0x65', '0xde', '0x6e', '0x19', '0x3b', '0xbb'
    ]);
  });

  it('mix case', () => {
    // prettier-ignore
    expect(encodeAddress('0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB')).toStrictEqual([
      '0xb4', '0x7e', '0x3c', '0xd8', '0x37', '0xdD', '0xF8', '0xe4', '0xc5', '0x7F', '0x05', '0xd7', '0x0A', '0xb8',
      '0x65', '0xde', '0x6e', '0x19', '0x3B', '0xBB'
    ]);
  });

  it('invalid address length', () => {
    // prettier-ignore
    expect(() => encodeAddress('0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbbaa')).toThrow('Invalid address: 0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbbaa');
  });

  it('invalid address checksum', () => {
    // prettier-ignore
    expect(() => encodeAddress('0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBb')).toThrow('Invalid address: 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBb');
  });
});

describe('encodeProofNode', () => {
  it('should pad to PROOF_ONE_LEVEL_LEN', () => {
    const encodedProofNode = encodeProofNode('0x01');

    expect(encodedProofNode[0]).toStrictEqual('0x01');
    expect(encodedProofNode[1]).toStrictEqual('0x00');
    expect(encodedProofNode.length).toBe(532);
  });
});

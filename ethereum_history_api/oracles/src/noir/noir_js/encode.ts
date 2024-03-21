import { Hex, isHex } from 'viem';
import { BYTE_HEX_LEN } from '../../util/const.js';
import { encodeByte } from '../oracles/common/encode.js';

// ENCODERS
export function encodeHexString(value: string): Hex[] {
  return Array.from(encodeHexStringToArray(value)).map((byte) => encodeByte(byte));
}

export function encodeHexStringToArray(value: string): Uint8Array {
  if (!isHex(value)) {
    throw new Error(`Invalid hexstring: ${value}`);
  }
  const arr = [];
  for (let i = 2; i < value.length; i += BYTE_HEX_LEN) {
    arr.push(parseInt(value.substr(i, BYTE_HEX_LEN), 16));
  }
  return new Uint8Array(arr);
}

export function encodeNullable(value: string | null): string {
  return 'Option::' + (value !== null ? `some(${value})` : 'none()');
}

export function formatArray(value: string[]): string {
  return `[
    ${value.join(',')}
  ]`;
}

// DECODERS
export function decodeHexString(proof: Uint8Array): string {
  return (
    '0x' +
    Array.from(proof)
      .map((byte) => byte.toString(16).padStart(BYTE_HEX_LEN, '0'))
      .join('')
  );
}

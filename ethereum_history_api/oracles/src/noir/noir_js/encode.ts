import { Hex, isHex } from 'viem';
import { BYTE_HEX_LENGTH } from '../../util/const.js';

// ENCODERS
export function encodeHexString(value: string): Hex[] {
  if (!isHex(value)) {
    throw new Error(`Invalid hexstring: ${value}`);
  }
  const chunks: Hex[] = [];
  for (let i = 2; i < value.length; i += BYTE_HEX_LENGTH) {
    chunks.push(`0x${value.substr(i, BYTE_HEX_LENGTH)}`);
  }
  return chunks;
}

export function encodeHexStringToArray(value: string): Uint8Array {
  if (!isHex(value)) {
    throw new Error(`Invalid hexstring: ${value}`);
  }
  const arr = [];
  for (let i = 2; i < value.length; i += BYTE_HEX_LENGTH) {
    arr.push(parseInt(value.substr(i, BYTE_HEX_LENGTH), 16));
  }
  return new Uint8Array(arr);
}

// DECODERS
export function decodeHexString(proof: Uint8Array): string {
  return (
    '0x' +
    Array.from(proof)
      .map((byte) => byte.toString(16).padStart(BYTE_HEX_LENGTH, '0'))
      .join('')
  );
}

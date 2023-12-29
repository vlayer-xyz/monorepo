import { Address, isAddress, toBytes } from 'viem';
import { assert } from '../assert.js';

export function hexToString(hex: string) {
  return String.fromCharCode(parseInt(hex, 16))
}

export function decodeHexAddress(arg: string[]): Address {
  const result = arg.map((e) => hexToString(e.slice(2))).join('');
  assert(isAddress(result), `Invalid address: ${result}`)
  return result as Address;
}

export function decodeField(arg: string) {
  return parseInt(arg[0], 16)
}

export function encodeField(arg: number | bigint) {
  return `0x${arg.toString(16)}`;
}

export function encodeBytes32(value: bigint) {
  assert(value >= 0n, 'Invalid Bytes32: Negative');
  assert(value < (1n << 256n), 'Invalid Bytes32: Overflow');
  const hexValue = value.toString(16).padStart(64, '0');
  const chunks = [];
  for (let i = 0; i < hexValue.length; i += 2) {
      const chunk = hexValue.substring(i, i + 2);
      chunks.push(`0x${chunk[0] == '0' ? chunk[1] : chunk}`);
  }
  return chunks;
}

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
  return encodeBytes(value, 32);
}

export function encodeAddress(value: bigint) {
  return encodeBytes(value, 20);
}

export function encodeBytes(value: bigint, length: number) {
  assert(value >= 0n, 'Invalid Bytes32: Negative');
  assert(value < (1n << (8n * BigInt(length))), 'Invalid Bytes32: Overflow');
  const hexValue = value.toString(16).padStart(length * 2, '0');
  const chunks = [];
  for (let i = 0; i < hexValue.length; i += 2) {
      const chunk = hexValue.substring(i, i + 2);
      chunks.push(`0x${chunk[0] == '0' ? chunk[1] : chunk}`);
  }
  return chunks;
}

export function encodeHexToBytes32(hex: string) {
  const chunks = [];
  for (let i = 2; i < hex.length; i += 2) {
    const chunk = hex.substring(i, i + 2);
    chunks.push(parseInt(chunk, 16));
  }
  return chunks;
}

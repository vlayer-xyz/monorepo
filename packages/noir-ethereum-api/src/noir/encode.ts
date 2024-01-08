import { type Address, isAddress, isHex } from 'viem';
import { assert } from '../assert.js';

export const MODULUS = 21888242871839275222246405745257275088696311157297823662689037894645226208583n;

export function hexToString(hex: string): string {
  return String.fromCharCode(parseInt(hex, 16));
}

export function decodeHexAddress(arg: string[]): Address {
  const result = arg.map((e) => hexToString(e.slice(2))).join('');
  assert(isAddress(result), `Invalid address: ${result}`);
  return result;
}

export function encodeField(arg: number | bigint): string {
  assert(arg < MODULUS, 'Field overflow');
  assert(arg >= 0, 'Field underflow');
  return `0x${arg.toString(16)}`;
}

export function encodeBytes32(value: bigint): string[] {
  return encodeBytes(value, 32);
}

export function encodeAddress(value: bigint): string[] {
  return encodeBytes(value, 20);
}

export function encodeBytes(value: bigint, length: number): string[] {
  assert(value >= 0n, 'Invalid Bytes32: Negative');
  assert(value < 1n << (8n * BigInt(length)), 'Invalid Bytes32: Overflow');
  const hexValue = value.toString(16).padStart(length * 2, '0');
  return encodeHex(`0x${hexValue}`);
}

export function encodeHex(hexString: string): string[] {
  if (!isHex(hexString)) {
    throw new Error(`Invalid hexstring: ${hexString}`);
  }
  const chunks = [];
  for (let i = 2; i < hexString.length; i += 2) {
    const chunk = hexString.substring(i, i + 2);
    chunks.push(`0x${chunk[0] === '0' ? chunk[1] : chunk}`);
  }
  return chunks;
}

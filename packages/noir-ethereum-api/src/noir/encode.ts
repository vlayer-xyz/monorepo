import { type Address, isAddress, isHex } from 'viem';
import { assert } from '../util/assert.js';

export const MODULUS = 21888242871839275222246405745257275088696311157297823662689037894645226208583n;

// ENCODERS
export function encodeField(arg: number | bigint): string {
  assert(arg < MODULUS, 'Field overflow');
  assert(arg >= 0, 'Field underflow');
  return `0x${arg.toString(16)}`;
}

export function encodeBytes32(value: bigint): string[] {
  return encodeBytes(value, 32);
}

export function encodeAddress(value: Address): string[] {
  assert(isAddress(value), `Invalid address: ${value}`);
  return encodeHex(value);
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

// DECODERS
export function decodeHexAddress(arg: string[]): Address {
  assert(arg.length === 20, `Invalid address length: ${arg.length}`);
  for (const e of arg) {
    const d = parseInt(e, 16);
    assert(0 <= d && d <= 255 && isHex(e), `Invalid address, with byte: ${e}`);
  }

  const result =
    '0x' +
    arg
      .map((e) => parseInt(e, 16))
      .map((e) => e.toString(16).padStart(2, '0'))
      .join('');

  assert(isAddress(result), `Invalid address: ${result}`);
  return result;
}

export function decodeField(arg: string): bigint {
  return BigInt(arg);
}

export function decodeHexString(proof: Uint8Array): string {
  return Array.from(proof)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

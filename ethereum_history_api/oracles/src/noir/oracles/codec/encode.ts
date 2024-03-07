import { type Address, isAddress, isHex } from 'viem';
import { assert } from '../../../util/assert.js';
import { BYTE_HEX_LENGTH } from '../../../util/const.js';
import { padArray } from '../../../util/array.js';
import { BITS_IN_BYTE, BYTES32_LENGTH, MODULUS, PROOF_ONE_LEVEL_LENGTH, ZERO_PAD_VALUE } from './const.js';

export function encodeField(arg: number | bigint): string {
  assert(arg < MODULUS, 'Field overflow');
  assert(arg >= 0, 'Field underflow');
  return `0x${arg.toString(16)}`;
}

export function encodeBytes32(value: bigint): string[] {
  return encodeBytes(value, BYTES32_LENGTH);
}

export function encodeAddress(value: Address): string[] {
  assert(isAddress(value), `Invalid address: ${value}`);
  return encodeHex(value);
}

export function encodeBytes(value: bigint, length: number): string[] {
  assert(value >= 0n, 'Invalid Bytes32: Negative');
  assert(value < 1n << (BITS_IN_BYTE * BigInt(length)), 'Invalid Bytes32: Overflow');
  const hexValue = value.toString(16).padStart(length * BYTE_HEX_LENGTH, '0');
  return encodeHex(`0x${hexValue}`);
}

export function encodeHex(hexString: string): string[] {
  if (!isHex(hexString)) {
    throw new Error(`Invalid hexstring: ${hexString}`);
  }
  const chunks = [];
  for (let i = BYTE_HEX_LENGTH; i < hexString.length; i += BYTE_HEX_LENGTH) {
    const chunk = hexString.substring(i, i + BYTE_HEX_LENGTH);
    chunks.push(`0x${chunk.startsWith('0') ? chunk[1] : chunk}`);
  }
  return chunks;
}

export function encodeProof(proof: string[], length: number): string[] {
  const encodedUnpaddedProof = proof
    .map((it) => encodeHex(it))
    .map((it) => padArray(it, PROOF_ONE_LEVEL_LENGTH, ZERO_PAD_VALUE))
    .reduce((accumulator, current) => accumulator.concat(current), []);
  const encodedProof = padArray(encodedUnpaddedProof, length, ZERO_PAD_VALUE);
  return encodedProof;
}

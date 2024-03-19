import { type Address, isAddress, isHex, Hex } from 'viem';
import { assert } from '../../../util/assert.js';
import { BYTE_HEX_LENGTH } from '../../../util/const.js';
import { padArray } from '../../../util/array.js';
import { BITS_IN_BYTE, BYTES32_LENGTH, MODULUS, PROOF_ONE_LEVEL_LENGTH, ZERO_PAD_VALUE } from './const.js';

export function encodeField(arg: number | bigint): Hex {
  assert(arg < MODULUS, 'Field overflow');
  assert(arg >= 0, 'Field underflow');
  if (arg === 0n || arg === 0) {
    return '0x';
  }
  let hex = arg.toString(16);
  if (hex.length % BYTE_HEX_LENGTH === 1) {
    hex = `0${hex}`;
  }
  return `0x${hex}`;
}

export function encodeBytes32(value: bigint): Hex[] {
  return encodeBytes(value, BYTES32_LENGTH);
}

export function encodeAddress(value: Address): Hex[] {
  assert(isAddress(value), `Invalid address: ${value}`);
  return encodeHex(value);
}

export function encodeBytes(value: bigint, length: number): Hex[] {
  assert(value >= 0n, 'Invalid Bytes32: Negative');
  assert(value < 1n << (BITS_IN_BYTE * BigInt(length)), 'Invalid Bytes32: Overflow');
  const hexValue = value.toString(16).padStart(length * BYTE_HEX_LENGTH, '0');
  return encodeHex(`0x${hexValue}`);
}

export function encodeHex(hexString: string): Hex[] {
  if (!isHex(hexString)) {
    throw new Error(`Invalid hex string: ${hexString}`);
  }
  const chunks: Hex[] = [];
  for (let i = BYTE_HEX_LENGTH; i < hexString.length; i += BYTE_HEX_LENGTH) {
    const chunk = hexString.substring(i, i + BYTE_HEX_LENGTH);
    chunks.push(`0x${chunk.padStart(BYTE_HEX_LENGTH, '0')}`);
  }
  return chunks;
}

export function encodeArray(array: Uint8Array, padLength: number) {
  return padArray(
    Array.from(array)
      .map((it) => it.toString(16))
      .map((it) => `0x${it.length < BYTE_HEX_LENGTH ? '0' : ''}${it}`),
    padLength,
    ZERO_PAD_VALUE
  );
}

export function encodeProofNode(node: Hex): Hex[] {
  return padArray(encodeHex(node), PROOF_ONE_LEVEL_LENGTH, ZERO_PAD_VALUE);
}

export function encodeProof(proof: Hex[], length: number): Hex[] {
  const encodedUnPaddedProof = proof.map(encodeProofNode).flat();
  return padArray(encodedUnPaddedProof, length, ZERO_PAD_VALUE);
}

import { type Address, isAddress, isHex, Hex } from 'viem';
import { assert } from '../../../util/assert.js';
import { BYTE_HEX_LEN } from '../../../util/const.js';
import { padArray } from '../../../util/array.js';
import { BITS_IN_BYTE, BYTES32_LEN, MODULUS, MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE, U128_MAX, U64_MAX } from './const.js';

export function encodeByte(byte: number): Hex {
  assert(byte < 256, 'Byte overflow');
  assert(byte >= 0, 'Byte underflow');
  return `0x${byte.toString(16).padStart(BYTE_HEX_LEN, '0')}`;
}

export function encodeField(arg: number | bigint): Hex {
  assert(arg < MODULUS, 'Field overflow');
  assert(arg >= 0, 'Field underflow');
  if (arg === 0n || arg === 0) {
    return '0x';
  }
  let hex = arg.toString(16);
  if (hex.length % BYTE_HEX_LEN === 1) {
    hex = `0${hex}`;
  }
  return `0x${hex}`;
}

export function encodeU128(arg: bigint): Hex[] {
  assert(arg < U128_MAX, 'U128 overflow');
  assert(arg >= 0, 'U128 underflow');

  return [encodeField(arg / (U64_MAX + 1n)), encodeField(arg % (U64_MAX + 1n))];
}

export function encodeBytes32(value: bigint): Hex[] {
  return encodeBytes(value, BYTES32_LEN);
}

export function encodeAddress(value: Address): Hex[] {
  assert(isAddress(value), `Invalid address: ${value}`);
  return encodeHex(value);
}

export function encodeBytes(value: bigint, length: number): Hex[] {
  assert(value >= 0n, 'Invalid Bytes32: Negative');
  assert(value < 1n << (BITS_IN_BYTE * BigInt(length)), 'Invalid Bytes32: Overflow');
  const hexValue = value.toString(16).padStart(length * BYTE_HEX_LEN, '0');
  return encodeHex(`0x${hexValue}`);
}

export function encodeUint8Array(uint8Array: Uint8Array): Hex[] {
  return Array.from(uint8Array).map(encodeByte);
}

export function encodeHex(hexString: string): Hex[] {
  if (!isHex(hexString)) {
    throw new Error(`Invalid hex string: ${hexString}`);
  }
  const chunks: Hex[] = [];
  const parity = hexString.length % BYTE_HEX_LEN;
  if (parity == 1) {
    chunks.push(`0x0${hexString[BYTE_HEX_LEN]}`);
  }
  for (let i = BYTE_HEX_LEN + parity; i < hexString.length; i += BYTE_HEX_LEN) {
    const chunk = hexString.substring(i, i + BYTE_HEX_LEN);
    chunks.push(`0x${chunk}`);
  }
  return chunks;
}

export function encodeProofNode(node: Hex): Hex[] {
  const encodedNode = encodeHex(node);
  assert(
    encodedNode.length <= MAX_TRIE_NODE_LEN,
    `Proof node length: ${encodedNode.length} is too large. Max proof node length: ${MAX_TRIE_NODE_LEN}`
  );
  return padArray(encodeHex(node), MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE);
}

export function encodeProof(proof: Hex[], length: number): Hex[] {
  const encodedUnPaddedProof = proof.map(encodeProofNode).flat();
  return padArray(encodedUnPaddedProof, length, ZERO_PAD_VALUE);
}

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

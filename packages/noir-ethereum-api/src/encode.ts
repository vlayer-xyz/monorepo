import { Address, isAddress } from 'viem';
import { assert } from './assert.js';

export function hexToString(hex: string) {
  return String.fromCharCode(parseInt(hex, 16))
}

export function argToAddress(arg: string[]) : Address {
  const result = arg.map((e) => hexToString(e.slice(2))).join('');
  assert(isAddress(result), `Invalid address: ${result}`)
  return result as Address;
}

export function argToBigIng(arg: string) {
  return parseInt(arg[0], 16)
}

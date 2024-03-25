import { assert } from './assert.js';
import { BYTE_HEX_LEN } from './const.js';

const PREFIX = '0x';

export function hasPrefix(hex: string): boolean {
  return hex.startsWith(PREFIX);
}

export function removePrefix(hex: string): string {
  assert(hasPrefix(hex), `Expected hex to have a prefix: ${hex}`);
  return hex.slice(PREFIX.length);
}

export function addPrefix(hex: string): string {
  assert(!hasPrefix(hex), `Expected hex to not have a prefix: ${hex}`);
  return `${PREFIX}${hex}`;
}

function padUnPrefixedToEven(hex: string): string {
  return hex.length % BYTE_HEX_LEN == 0 ? hex : `0${hex}`;
}

export function padToEven(hex: string): string {
  if (hasPrefix(hex)) {
    return addPrefix(padUnPrefixedToEven(removePrefix(hex)));
  } else {
    return padUnPrefixedToEven(hex);
  }
}

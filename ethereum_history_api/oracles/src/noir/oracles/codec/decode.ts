import { type Address, isAddress, isHex } from 'viem';
import { assert } from '../../../util/assert.js';
import { BYTE_HEX_LENGTH } from '../../../util/const.js';
import { ADDRESS_LENGTH, MAX_U8 } from './const.js';

export function decodeHexAddress(arg: string[]): Address {
  assert(arg.length === ADDRESS_LENGTH, `Invalid address length: ${arg.length}`);
  for (const e of arg) {
    const d = parseInt(e, 16);
    assert(0 <= d && d <= MAX_U8 && isHex(e), `Invalid address, with byte: ${e}`);
  }

  const result =
    '0x' +
    arg
      .map((e) => parseInt(e, 16))
      .map((e) => e.toString(16).padStart(BYTE_HEX_LENGTH, '0'))
      .join('');

  assert(isAddress(result), `Invalid address: ${result}`);
  return result;
}

export function decodeField(arg: string): bigint {
  return BigInt(arg);
}

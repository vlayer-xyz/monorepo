import { Hex, isHex } from 'viem';
import { BYTE_HEX_LEN } from '../../util/const.js';
import { encodeByte } from '../oracles/common/encode.js';

const INDENT = '  ';

// ENCODERS
export function encodeHexString(value: string): Hex[] {
  return Array.from(encodeHexStringToArray(value)).map((byte) => encodeByte(byte));
}

export function encodeHexStringToArray(value: string): Uint8Array {
  if (!isHex(value)) {
    throw new Error(`Invalid hex string: ${value}`);
  }
  if (value.length % BYTE_HEX_LEN !== 0) {
    value = value.slice(0, BYTE_HEX_LEN) + '0' + value.slice(BYTE_HEX_LEN);
  }
  const arr = [];
  for (let i = 2; i < value.length; i += BYTE_HEX_LEN) {
    arr.push(parseInt(value.substr(i, BYTE_HEX_LEN), 16));
  }
  return new Uint8Array(arr);
}

export function encodeOptional(value: string | undefined | null): string {
  if (value !== undefined && value !== null) {
    return `Option::some(${value})`;
  } else {
    return 'Option::none()';
  }
}

export function joinArray(value: string[]): string {
  return `[
${INDENT}${value.join(', ')}
]`;
}

export function joinArrayVertical(value: string[]): string {
  return `[
${value.map((val) => indentBlock(val, 1, false)).join(',\n')}
]`;
}

export function indentLine(line: string, depth: number): string {
  return INDENT.repeat(depth) + line;
}

export function indentBlock(value: string, depth: number, doNotIndentFirstLine = true): string {
  const lines = value.split('\n');
  return lines
    .map((line, idx) => {
      return doNotIndentFirstLine && idx === 0 ? line : indentLine(line, depth);
    })
    .join('\n');
}

// DECODERS
export function decodeHexString(proof: Uint8Array): string {
  return (
    '0x' +
    Array.from(proof)
      .map((byte) => byte.toString(16).padStart(BYTE_HEX_LEN, '0'))
      .join('')
  );
}

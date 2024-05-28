import { BYTE_HEX_LEN } from '../../../../util/const.js';

export const RLP_SHORT_ENTITY_MAX_LEN = 55;

export function getMaxRlpHeaderSize(len: number): number {
  if (len <= RLP_SHORT_ENTITY_MAX_LEN) {
    return 1;
  } else {
    return 1 + Math.ceil(len.toString(16).length / BYTE_HEX_LEN);
  }
}

export function getMaxRlpEncodedSize(len: number): number {
  return getMaxRlpHeaderSize(len) + len;
}

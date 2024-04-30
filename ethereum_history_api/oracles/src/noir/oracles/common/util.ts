import { BYTE_HEX_LEN } from '../../../util/const.js';

export const RLP_SHORT_ENTITY_MAX_LEN = 55;

export function getRlpHeaderSize(strLen: number): number {
  if (strLen <= RLP_SHORT_ENTITY_MAX_LEN) {
    return 1;
  } else {
    return 1 + Math.ceil(strLen.toString(16).length / BYTE_HEX_LEN);
  }
}

export function getRlpEncodedSize(len: number): number {
  return getRlpHeaderSize(len) + len;
}

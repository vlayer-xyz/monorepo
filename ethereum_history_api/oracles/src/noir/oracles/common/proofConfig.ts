import { BYTE_HEX_LEN } from '../../../util/const.js';
import { MAX_TRIE_NODE_LEN } from './const.js';
import { getRlpHeaderSize } from './util.js';

export interface ProofConfig {
  maxPrefixedKeyNibbleLen: number;
  maxLeafLen: number;
  maxProofLen: number;
}

export function getProofConfig(maxKeyLen: number, maxValueLen: number, maxProofLevels: number): ProofConfig {
  const maxPrefixedKeyLen = 1 + maxKeyLen;
  const maxPrefixedKeyNibbleLen = maxPrefixedKeyLen * BYTE_HEX_LEN;
  const maxKeyRlpHeaderLen = getRlpHeaderSize(maxPrefixedKeyLen);
  const maxValueRlpHeaderLen = getRlpHeaderSize(maxValueLen);
  const maxLeafContentLen = maxKeyRlpHeaderLen + maxPrefixedKeyLen + maxValueRlpHeaderLen + maxValueLen;
  const maxLeafRlpHeaderLen = getRlpHeaderSize(maxLeafContentLen);
  const maxLeafLen = maxLeafRlpHeaderLen + maxLeafContentLen;

  const maxProofLen = MAX_TRIE_NODE_LEN * maxProofLevels;

  return {
    maxPrefixedKeyNibbleLen,
    maxLeafLen,
    maxProofLen
  };
}

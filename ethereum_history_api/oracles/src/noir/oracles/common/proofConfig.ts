import { BYTE_HEX_LEN } from '../../../util/const.js';
import { MAX_TRIE_NODE_LEN } from './const.js';
import { getRlpEncodedSize } from './util.js';

export interface ProofConfig {
  maxPrefixedKeyNibbleLen: number;
  maxLeafLen: number;
  maxProofLen: number;
}

export function getProofConfig(maxKeyLen: number, maxValueLen: number, maxProofLevels: number): ProofConfig {
  const maxPrefixedKeyLen = 1 + maxKeyLen;
  const maxPrefixedKeyNibbleLen = maxPrefixedKeyLen * BYTE_HEX_LEN;
  const maxLeafContentLen = getRlpEncodedSize(maxPrefixedKeyLen) + getRlpEncodedSize(maxValueLen);

  const maxProofLen = MAX_TRIE_NODE_LEN * maxProofLevels;

  return {
    maxPrefixedKeyNibbleLen,
    maxLeafLen: getRlpEncodedSize(maxLeafContentLen),
    maxProofLen
  };
}

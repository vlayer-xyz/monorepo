import { BYTE_HEX_LEN } from '../../../../util/const.js';
import { MAX_TRIE_NODE_LEN } from '../../common/const.js';
import { getMaxRlpEncodedSize } from './util.js';

export interface ProofConfig {
  maxKeyLen: number;
  maxValueLen: number;
  maxPrefixedKeyNibbleLen: number;
  maxLeafLen: number;
  maxProofDepth: number;
  maxProofLen: number;
}

export function getProofConfig(maxKeyLen: number, maxValueLen: number, maxProofDepth: number): ProofConfig {
  const maxPrefixedKeyLen = 1 + maxKeyLen;
  const maxPrefixedKeyNibbleLen = maxPrefixedKeyLen * BYTE_HEX_LEN;
  const maxLeafContentLen = getMaxRlpEncodedSize(maxPrefixedKeyLen) + getMaxRlpEncodedSize(maxValueLen);

  const maxProofLen = MAX_TRIE_NODE_LEN * maxProofDepth;

  return {
    maxKeyLen,
    maxValueLen,
    maxPrefixedKeyNibbleLen,
    maxLeafLen: getMaxRlpEncodedSize(maxLeafContentLen),
    maxProofDepth,
    maxProofLen
  };
}

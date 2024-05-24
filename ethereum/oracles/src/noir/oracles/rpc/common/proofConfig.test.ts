import { describe, expect, it } from 'vitest';
import { getProofConfig } from './proofConfig.js';
import { MAX_TRIE_NODE_LEN } from '../../common/const.js';

describe('getProofConfig', () => {
  it('state proof', () => {
    const maxKeyLen = 32;
    const maxValueLen = 110;
    const maxProofLevels = 11;
    const config = getProofConfig(maxKeyLen, maxValueLen, maxProofLevels);
    expect(config.maxPrefixedKeyNibbleLen).toStrictEqual(2 * (1 + maxKeyLen));
    expect(config.maxLeafLen).toStrictEqual(148);
    expect(config.maxProofLen).toStrictEqual(maxProofLevels * MAX_TRIE_NODE_LEN);
  });
});

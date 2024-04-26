import { describe, expect, it } from 'vitest';
import { getProofConfig } from './proofConfig.js';

describe('getProofConfig', () => {
  it('', () => {
    const maxKeyLen = 3;
    const maxValueLen = 110;
    const maxProofLevels = 11;
    const config = getProofConfig(maxKeyLen, maxValueLen, maxProofLevels);
    expect(config.maxPrefixedKeyNibbleLen).toStrictEqual(8);
    expect(config.maxLeafLen).toStrictEqual(119);
    expect(config.maxProofLen).toStrictEqual(5852);
  });
});

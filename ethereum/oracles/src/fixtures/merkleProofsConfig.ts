import { Hex } from 'viem';

// Values in the merkle trie need to be big as @ethereumjs/trie trie
// implementation only hashes nodes with big enough values.
const BIG_VALUE = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

export interface ProofFixtureConfig {
  key: Hex;
  keyValuePairs: { key: Hex; value: Hex }[];
}

type ProofFixtures = Record<string, ProofFixtureConfig>;

export const PROOF_FIXTURES: ProofFixtures = {
  leaf: {
    key: '0x01',
    keyValuePairs: [{ key: '0x01', value: BIG_VALUE }]
  },
  branch_then_leaf: {
    key: '0x01',
    keyValuePairs: [
      { key: '0x01', value: BIG_VALUE },
      { key: '0x11', value: BIG_VALUE }
    ]
  },
  extension_odd: {
    key: '0x123a',
    keyValuePairs: [
      { key: '0x123a', value: BIG_VALUE },
      { key: '0x123b', value: BIG_VALUE }
    ]
  },
  extension_even: {
    key: '0xa1234a',
    keyValuePairs: [
      { key: '0xa1234a', value: BIG_VALUE },
      { key: '0xa1234b', value: BIG_VALUE },
      { key: '0xb00000', value: BIG_VALUE }
    ]
  }
};

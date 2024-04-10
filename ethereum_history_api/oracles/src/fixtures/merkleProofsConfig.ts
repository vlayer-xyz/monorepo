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
  }
};

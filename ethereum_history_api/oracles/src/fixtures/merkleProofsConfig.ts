import { Hex } from 'viem';

// Values in the merkle trie need to be big as @ethereumjs/trie trie
// implementation only hashes nodes with big enough values.
const BIG_VALUE = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

export interface ProofFixtureInput {
  key: Hex;
  keyValuePairs: { key: Hex; value: Hex }[];
}

type ProofFixtureInputs = Record<string, ProofFixtureInput>;

export const PROOF_FIXTURES: ProofFixtureInputs = {
  leaf: {
    key: '0x01',
    keyValuePairs: [{ key: '0x01', value: BIG_VALUE }]
  },
  depth_one_single_branch: {
    key: '0x01',
    keyValuePairs: [
      { key: '0x01', value: BIG_VALUE },
      { key: '0x11', value: BIG_VALUE }
    ]
  }
};

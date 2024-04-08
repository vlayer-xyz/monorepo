import { Hex } from 'viem';

// Values in the merkle trie need to be big as @ethereumjs/trie trie
// implementation only hashes nodes with big enough values.
const BIG_VALUE = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

export interface ProofFixture {
  key: Hex;
  keyValuePairs: { key: Hex; value: Hex }[];
}

type ProofFixtures = Record<string, Record<string, ProofFixture>>;

export const PROOF_FIXTURES: ProofFixtures = {
  merkle_proofs: {
    leaf: {
      key: '0x01',
      keyValuePairs: [{ key: '0x01', value: BIG_VALUE }]
    },
    depth_one_no_extensions: {
      key: '0x01',
      keyValuePairs: [
        { key: '0x01', value: BIG_VALUE },
        { key: '0x11', value: BIG_VALUE }
      ]
    }
  }
};

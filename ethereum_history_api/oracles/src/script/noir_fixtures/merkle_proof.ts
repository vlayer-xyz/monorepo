import { encodeHex } from '../../noir/oracles/common/encode.js';
import { indentBlock, joinArray } from '../../noir/noir_js/encode.js';
import { padArray } from '../../util/array.js';
import { MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { BYTE_HEX_LEN } from '../../util/const.js';
import { Proof } from '../../ethereum/proof.js';

export function createMerkleProofFixture(proof: Proof) {
  const keyHex = encodeHex(proof.key);
  const maxPrefixedKeyNibbleLen = (keyHex.length + 1) * BYTE_HEX_LEN;
  const key = indentBlock(joinArray(padArray(keyHex, maxPrefixedKeyNibbleLen, ZERO_PAD_VALUE, 'left')), 1);
  const value = indentBlock(joinArray(encodeHex(proof.value)), 1);
  const proof_nodes = proof.proof.slice(0, proof.proof.length - 1);
  const proof_leaf = proof.proof[proof.proof.length - 1];
  const nodes = indentBlock(
    joinArray(
      proof_nodes.map((node) => indentBlock(joinArray(padArray(encodeHex(node), MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE)), 1))
    ),
    1 + 1
  );
  const leaf = indentBlock(joinArray(encodeHex(proof_leaf)), 1 + 1);
  const depth = proof.proof.length;

  return `use crate::merkle_patricia_proofs::proof::{Proof, ProofInput};

global proof_input = ProofInput {\n
  key: ${key},
  value: ${value},

  proof: Proof {
    nodes: ${nodes},
    leaf: ${leaf},
    depth: ${depth}
  }
};
`;
}

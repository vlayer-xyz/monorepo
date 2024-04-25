import { encodeHex } from '../../noir/oracles/common/encode.js';
import { indentBlock, joinArray } from '../../noir/noir_js/encode.js';
import { padArray } from '../../util/array.js';
import { MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { Proof } from '../../ethereum/proof.js';
import { padHex } from 'viem';

export function createNewProofInputFixture(
  proof: Proof,
  maxPrefixedKeyNibbleLen: number,
  maxValueLen: number,
  maxLeafLen: number,
  maxDepth: number
): string {
  const paddedKey = padHex(proof.key, { size: maxPrefixedKeyNibbleLen, dir: 'left' });
  const key = encodeHex(paddedKey);
  const paddedValue = padHex(proof.value, { size: maxValueLen, dir: 'left' });
  const value = encodeHex(paddedValue);

  return `use crate::merkle_patricia_proofs::proof::{Proof, ProofInput};

global proof_input = ProofInput {\n
  key: ${indentBlock(joinArray(key), 1)},
  value: ${indentBlock(joinArray(value), 1)},

  proof: ${indentBlock(createProofFixture(proof, maxDepth, maxLeafLen), 1)}
};
`;
}

function createProofFixture(proof: Proof, maxDepth: number, maxLeafLen: number): string {
  const paddedNodes = padArray(proof.proof.slice(0, proof.proof.length - 1), maxDepth, ZERO_PAD_VALUE);
  const nodes = paddedNodes.map((node) =>
    indentBlock(joinArray(padArray(encodeHex(node), MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE)), 1)
  );
  const leaf = padArray(encodeHex(proof.proof[proof.proof.length - 1]), maxLeafLen, ZERO_PAD_VALUE);
  const depth = proof.proof.length;

  return `Proof {
  nodes: ${indentBlock(joinArray(nodes), 1)},
  leaf: ${indentBlock(joinArray(leaf), 1)},
  depth: ${depth}
}`;
}

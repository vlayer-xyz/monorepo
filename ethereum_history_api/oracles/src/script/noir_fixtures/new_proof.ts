import { encodeHex } from '../../noir/oracles/common/encode.js';
import { indentBlock, joinArray, joinArrayVertical } from '../../noir/noir_js/encode.js';
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

  return `ProofInput {\n
  key: ${indentBlock(joinArray(key), 1)},
  value: ${indentBlock(joinArray(value), 1)},

  proof: ${indentBlock(createProofFixture(proof, maxDepth, maxLeafLen), 1)}
}`;
}

export function createNewTopLevelProofInputFixture(
  proof: Proof,
  maxPrefixedKeyNibbleLen: number,
  maxValueLen: number,
  maxLeafLen: number,
  maxDepth: number
): string {
  return `use crate::merkle_patricia_proofs::proof::{Proof, ProofInput};

global proof_input = ${createNewProofInputFixture(proof, maxPrefixedKeyNibbleLen, maxValueLen, maxLeafLen, maxDepth)};
`;
}

function createProofFixture(proof: Proof, maxDepth: number, maxLeafLen: number): string {
  const paddedNodes = padArray(proof.proof.slice(0, proof.proof.length - 1), maxDepth - 1, ZERO_PAD_VALUE);
  const nodes = paddedNodes.map((node) => joinArray(padArray(encodeHex(node), MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE)));
  const leaf = padArray(encodeHex(proof.proof[proof.proof.length - 1]), maxLeafLen, ZERO_PAD_VALUE);
  const depth = proof.proof.length;

  return `Proof {
  nodes: ${indentBlock(joinArrayVertical(nodes), 1)},
  leaf: ${indentBlock(joinArray(leaf), 1)},
  depth: ${depth}
}`;
}

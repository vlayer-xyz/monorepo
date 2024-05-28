import { encodeHex } from '../../noir/oracles/common/encode.js';
import { indentBlock, joinArray, joinArrayVertical } from '../../noir/noir_js/encode.js';
import { padArray } from '../../util/array.js';
import { MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { Proof } from '../../ethereum/proof.js';
import { Hex, padHex } from 'viem';
import { ProofConfig } from '../../noir/oracles/rpc/common/proofConfig.js';

export function createTopLevelProofFixtureWithRoot(proof: Proof, root: Hex[], config: ProofConfig): string {
  return `use crate::merkle_patricia_proofs::proof::{Proof, ProofInput};

global root = ${joinArray(root)};

global proof_input = ${createProofInputFixture(proof, config)};
`;
}

export function createTopLevelProofFixture(proof: Proof, config: ProofConfig): string {
  return `use crate::merkle_patricia_proofs::proof::{Proof, ProofInput};

global proof_input = ${createProofInputFixture(proof, config)};

global proof_input_serialized = proof_input.serialize();
`;
}

export function createProofInputFixture(proof: Proof, config: ProofConfig): string {
  const paddedKey = padHex(proof.key, { size: config.maxPrefixedKeyNibbleLen, dir: 'left' });
  const key = encodeHex(paddedKey);
  const paddedValue = padHex(proof.value, { size: config.maxValueLen, dir: 'left' });
  const value = encodeHex(paddedValue);

  return `ProofInput {\n
  key: ${indentBlock(joinArray(key), 1)},
  value: ${indentBlock(joinArray(value), 1)},

  proof: ${indentBlock(createProofFixture(proof, config.maxProofDepth, config.maxLeafLen), 1)}
}`;
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

import { encodeHex, encodeUint8Array } from '../../noir/oracles/common/encode.js';
import { indentBlock, joinArray } from '../../noir/noir_js/encode.js';
import { Hex } from 'viem';

interface ProofFixture {
  key: Hex;
  value: Hex;
  root: Uint8Array;
  proof: {
    nodes: Uint8Array[];
    leaf: Uint8Array;
  };
}

export function createMerkleProofFixture(proofFixture: ProofFixture) {
  const key = joinArray(encodeHex(proofFixture.key));
  const value = joinArray(encodeHex(proofFixture.value));
  const root = joinArray(encodeUint8Array(proofFixture.root));
  const nodes = joinArray(proofFixture.proof.nodes.map((node) => indentBlock(joinArray(encodeUint8Array(node)), 1)));
  const leaf = joinArray(encodeUint8Array(proofFixture.proof.leaf));
  return `global key = ${indentBlock(key, 1)};\n
global value = ${indentBlock(value, 1)};\n
global root = ${indentBlock(root, 1)};\n
global nodes = ${indentBlock(nodes, 1)};\n
global leaf = ${indentBlock(leaf, 1)};
`;
}

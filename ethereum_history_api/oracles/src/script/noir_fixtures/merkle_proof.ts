import { encodeHex, encodeUint8Array } from '../../noir/oracles/common/encode.js';
import { joinArray } from '../../noir/noir_js/encode.js';
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
  const root = encodeUint8Array(proofFixture.root);
  const key = encodeHex(proofFixture.key);
  const value = encodeHex(proofFixture.value);
  const nodes = proofFixture.proof.nodes.map((node) => encodeUint8Array(node));
  const leaf = encodeUint8Array(proofFixture.proof.leaf);
  return `global key = ${joinArray(key)};
global value = ${joinArray(value)};
global root = ${joinArray(root)};
global nodes = [${nodes.length > 0 ? '[' + nodes.map((node) => joinArray(node)).join('], [') + ']' : ''}];
global leaf = ${joinArray(leaf)};
`;
}

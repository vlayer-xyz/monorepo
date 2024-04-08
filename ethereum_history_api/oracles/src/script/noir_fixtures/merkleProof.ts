import { Proof, Trie } from '@ethereumjs/trie';
import { encodeHex, encodeUint8ArrayToBytes } from '../../noir/oracles/common/encode.js';
import { encodeHexStringToArray } from '../../main.js';
import { joinArray } from '../../noir/noir_js/encode.js';
import { Hex } from 'viem';

interface ProofFixture {
  root: Uint8Array;
  key: Hex;
  value: None; // TODO: take calue from prepareMerkleqProofFixtures.ts
  nodes: Uint8Array[];
  leaf: Uint8Array;
}

export async function createMerkleProofFixture(proofFixture: ProofFixture) {
  const root = encodeUint8ArrayToBytes(proofFixture.root);
  const key = encodeHex(proofFixture.key);
  const value = encodeUint8ArrayToBytes(exampleValue);
  return `global root = ${joinArray()};
global key = ${joinArray()};
global value = ${joinArray(encodeUint8ArrayToBytes(exampleValue))};
global nodes = [${nodes.length > 0 ? '[' + nodes.map((proofOneLevel) => joinArray(encodeUint8ArrayToBytes(proofOneLevel))).join('], [') + ']' : ''}];
global leaf = ${joinArray(encodeUint8ArrayToBytes(leaf))};
`;
}

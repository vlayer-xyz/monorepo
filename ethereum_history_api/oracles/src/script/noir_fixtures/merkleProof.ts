import { Trie } from '@ethereumjs/trie';
import { encodeHex, encodeUint8ArrayToBytes } from '../../noir/oracles/common/encode.js';
import { encodeHexStringToArray } from '../../main.js';
import { ProofInput } from '../prepareProofFixtures.js';
import { joinArray } from '../../noir/noir_js/encode.js';

const exampleValue = encodeHexStringToArray('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');

export async function createMerkleProofFixture(proofInput: ProofInput) {
  const trie = new Trie();
  for (const keyValuePair of proofInput.keyValuePairs) {
    await trie.put(encodeHexStringToArray(keyValuePair.key), encodeHexStringToArray(keyValuePair.value));
  }

  const key = proofInput.key;
  const proof = await trie.createProof(encodeHexStringToArray(key));
  const nodes = proof.slice(0, proof.length - 1);
  const leaf = proof[proof.length - 1];

  return `global root = ${joinArray(encodeUint8ArrayToBytes(trie.root()))};
global key = ${joinArray(encodeHex(key))};
global value = ${joinArray(encodeUint8ArrayToBytes(exampleValue))};
global nodes = [${nodes.length > 0 ? '[' + nodes.map((proofOneLevel) => joinArray(encodeUint8ArrayToBytes(proofOneLevel))).join('], [') + ']' : ''}];
global leaf = ${joinArray(encodeUint8ArrayToBytes(leaf))};
`;
}

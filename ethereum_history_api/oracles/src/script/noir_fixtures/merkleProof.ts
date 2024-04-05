import { Trie } from '@ethereumjs/trie';
import { encodeByte, encodeField } from '../../noir/oracles/common/encode.js';
import { encodeHexStringToArray } from '../../main.js';

const exampleValue = encodeHexStringToArray('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');

export async function createMerkleProofFixture(keys: number[]) {
  const trie = new Trie();
  const keysUInt8Array = keys.map((key) => encodeHexStringToArray(encodeField(key)));
  for (const key of keysUInt8Array) {
    await trie.put(key, exampleValue);
  }

  const key = keysUInt8Array[0];
  const proof = await trie.createProof(key);
  const nodes = proof.slice(0, proof.length - 1);
  const leaf = proof[proof.length - 1];

  return `global key = ${key.join(', ')};
global value = [${Array.from(exampleValue).map(encodeByte).join(', ')}];
global nodes = [[${nodes.map((proofOneLevel) => Array.from(proofOneLevel).map(encodeByte).join(', ')).join('], [')}]];
global leaf = [${Array.from(leaf).map(encodeByte).join(', ')}];
`;
}

import { Trie } from '@ethereumjs/trie';
import { encodeHex } from '../../noir/oracles/common/encode.js';

const exampleValue = '0x010203040';

export async function createMerkleProofFixture(keys: number[]) {
  const trie = new Trie();
  for (const key of keys) {
    await trie.put(key, exampleValue);
  }
  const key = keys[0];
  const proof = await trie.createProof(key);
  const nodes = proof.slice(0, proof.length - 1);
  const leaf = proof[proof.length - 1];

  return `global key = ${key};
global value = [${encodeHex(exampleValue).join(', ')}];
global proof = [[${proof.map((proofOneLevel) => proofOneLevel.join(', ')).join('], [')}]];
`;
}

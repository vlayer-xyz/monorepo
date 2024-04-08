import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createMerkleProofFixture } from './noir_fixtures/merkleProof.js';
import { Trie } from '@ethereumjs/trie';
import { PROOF_FIXTURES } from '../fixtures/merkleProofsConfig.js';
import { encodeHexStringToArray } from '../main.js';

const NOIR_PROOF_FIXTURES_DIRECTORY = '../circuits/lib/src/fixtures/merkle_proofs';

for (const fixtureName in PROOF_FIXTURES) {
  const trie = new Trie();
  for (const keyValuePair of PROOF_FIXTURES[fixtureName].keyValuePairs) {
    await trie.put(encodeHexStringToArray(keyValuePair.key), encodeHexStringToArray(keyValuePair.value));
  }

  // TODO:
  // 1. check if key in keyValuePairs
  // 2. find value corresponding to key
  const key = PROOF_FIXTURES[fixtureName].key;
  const proof = await trie.createProof(encodeHexStringToArray(key));
  const root = trie.root();
  const nodes = proof.slice(0, proof.length - 1);
  const leaf = proof[proof.length - 1];

  await writeFile(`${NOIR_PROOF_FIXTURES_DIRECTORY}/${fixtureName}.nr`, await createMerkleProofFixture(null));
}

import { mkdir, writeFile } from 'fs/promises';
import { createMerkleProofFixture } from './noir_fixtures/merkle_proof.js';
import { Trie } from '@ethereumjs/trie';
import { PROOF_FIXTURES } from '../fixtures/merkleProofsConfig.js';
import { assert, encodeHexStringToArray } from '../main.js';
import { hasDuplicates } from '../util/array.js';

const NOIR_PROOF_FIXTURES_DIRECTORY = '../circuits/lib/src/fixtures/merkle_proofs';

let fixtureModule = ``;
const fixtureModuleFile = `${NOIR_PROOF_FIXTURES_DIRECTORY}.nr`;

for (const fixtureName in PROOF_FIXTURES) {
  await mkdir(NOIR_PROOF_FIXTURES_DIRECTORY, { recursive: true });

  const keyValuePairs = PROOF_FIXTURES[fixtureName].keyValuePairs;
  assert(
    !hasDuplicates(keyValuePairs.map((keyValuePair) => keyValuePair.key)),
    `Duplicate keys in fixture ${fixtureName} (merkleProofsConfig.ts) are not allowed`
  );

  const trie = new Trie();
  for (const keyValuePair of keyValuePairs) {
    await trie.put(encodeHexStringToArray(keyValuePair.key), encodeHexStringToArray(keyValuePair.value));
  }
  const key = PROOF_FIXTURES[fixtureName].key;
  const proof = await trie.createProof(encodeHexStringToArray(key));
  const value = keyValuePairs.find((keyValuePair) => keyValuePair.key === key)?.value;
  assert(value !== undefined, `Key ${key} not found in keyValuePairs of ${fixtureName} (see merkleProofConfig.ts)`);

  const proofFixture = {
    key,
    value,
    root: trie.root(),
    proof: { nodes: proof.slice(0, proof.length - 1), leaf: proof[proof.length - 1] }
  };
  await writeFile(`${NOIR_PROOF_FIXTURES_DIRECTORY}/${fixtureName}.nr`, createMerkleProofFixture(proofFixture));

  fixtureModule += `mod ${fixtureName};\n`;
}
await writeFile(fixtureModuleFile, fixtureModule);

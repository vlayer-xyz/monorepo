import { mkdir, rm, writeFile } from 'fs/promises';
import { Trie } from '@ethereumjs/trie';
import { PROOF_FIXTURES } from '../fixtures/merkleProofsConfig.js';
import { assert, encodeHexStringToArray } from '../main.js';
import { hasDuplicates } from '../util/array.js';
import { bytesToHex } from 'viem';
import { createTopLevelProofFixtureWithRoot } from './noir_fixtures/proof.js';
import { getProofConfig } from '../noir/oracles/rpc/common/proofConfig.js';
import { BYTE_HEX_LEN } from '../util/const.js';
import { encodeUint8Array } from '../noir/oracles/common/encode.js';

const NOIR_PROOF_FIXTURES_DIRECTORY = '../circuits/lib/src/fixtures/merkle_proofs';
const MAX_VALUE_LEN = 100;
const MAX_DEPTH = 10;

let fixtureModule = ``;
const fixtureModuleFile = `${NOIR_PROOF_FIXTURES_DIRECTORY}.nr`;

await rm(NOIR_PROOF_FIXTURES_DIRECTORY, { recursive: true, force: true });
await rm(fixtureModuleFile, { force: true });
await mkdir(NOIR_PROOF_FIXTURES_DIRECTORY, { recursive: true });

for (const fixtureName in PROOF_FIXTURES) {
  const { keyValuePairs, key } = PROOF_FIXTURES[fixtureName];
  assert(
    !hasDuplicates(keyValuePairs.map((keyValuePair) => keyValuePair.key)),
    `Duplicate keys in fixture ${fixtureName} (merkleProofsConfig.ts) are not allowed`
  );

  const trie = new Trie();
  for (const keyValuePair of keyValuePairs) {
    await trie.put(encodeHexStringToArray(keyValuePair.key), encodeHexStringToArray(keyValuePair.value));
  }
  const value = keyValuePairs.find((keyValuePair) => keyValuePair.key === key)?.value;
  assert(value !== undefined, `Key ${key} not found in keyValuePairs of ${fixtureName} (see merkleProofConfig.ts)`);
  const proof = await trie.createProof(encodeHexStringToArray(key));

  const proofFixture = {
    key,
    value,
    proof: proof.map((node) => bytesToHex(node))
  };
  const root = encodeUint8Array(trie.root());
  const maxKeyLen = proofFixture.key.length / BYTE_HEX_LEN - 1;
  const config = getProofConfig(maxKeyLen, MAX_VALUE_LEN, MAX_DEPTH);
  await writeFile(
    `${NOIR_PROOF_FIXTURES_DIRECTORY}/${fixtureName}.nr`,
    createTopLevelProofFixtureWithRoot(proofFixture, root, config)
  );

  fixtureModule += `mod ${fixtureName};\n`;
}
await writeFile(fixtureModuleFile, fixtureModule);

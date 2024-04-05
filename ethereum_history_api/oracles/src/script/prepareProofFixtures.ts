import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createMerkleProofFixture } from './noir_fixtures/merkleProof.js';
import { Hex } from 'viem';

const NOIR_FIXTURES_DIRECTORY = '../circuits/lib/src/fixtures';
const exampleValue = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

export type ProofInput = {
  key: Hex;
  keyValuePairs: { key: Hex; value: Hex }[];
};

const proofInput: ProofInput = {
  key: '0x11',
  keyValuePairs: [{ key: '0x11', value: exampleValue }]
};

await writeFile(join(NOIR_FIXTURES_DIRECTORY, 'proof.nr'), await createMerkleProofFixture(proofInput));

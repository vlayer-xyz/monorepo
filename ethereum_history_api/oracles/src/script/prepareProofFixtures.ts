import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createMerkleProofFixture } from './noir_fixtures/merkleProof.js';

const NOIR_FIXTURES_DIRECTORY = '../circuits/lib/src/fixtures';

const keySets = [[0x1, 0x11], [0x11], [0x111], [0x1111]];

await writeFile(join(NOIR_FIXTURES_DIRECTORY, 'proof.nr'), await createMerkleProofFixture(keySets[1]));

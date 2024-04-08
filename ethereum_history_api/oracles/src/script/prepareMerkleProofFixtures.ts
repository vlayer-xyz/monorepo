import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createMerkleProofFixture } from './noir_fixtures/merkleProof.js';

const NOIR_FIXTURES_DIRECTORY = '../circuits/lib/src/fixtures';

// await writeFile(join(NOIR_FIXTURES_DIRECTORY, 'proof.nr'), await createMerkleProofFixture(null));

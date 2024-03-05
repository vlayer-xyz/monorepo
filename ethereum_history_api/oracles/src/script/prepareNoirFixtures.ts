import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { createDefaultClient } from '../ethereum/client.js';
import { createHeaderFixture } from './noir_fixtures/header.js';
import { createStateProofFixture } from './noir_fixtures/state_proof.js';
import { createAccountFixture } from './noir_fixtures/account.js';
import { createStorageProofFixture } from './noir_fixtures/storage_proof.js';
import { FIXTURES } from '../fixtures/config.js';

const NOIR_FIXTURES_DIRECTORY = '../circuits/lib/src/fixtures';
await rm(NOIR_FIXTURES_DIRECTORY, { recursive: true, force: true });

const client = createDefaultClient();
for (const hardFork in FIXTURES) {
  let hardforkModule = ``;
  const hardforkModuleFile = `${NOIR_FIXTURES_DIRECTORY}/${hardFork}.nr`;

  for (const fixtureName in FIXTURES[hardFork]) {
    const { blockNumber, address, storageKeys } = FIXTURES[hardFork][fixtureName];

    const block = await client.getBlock({ blockNumber });
    const stateProof = await client.getProof({
      address,
      storageKeys: storageKeys || [],
      blockNumber
    });

    const modulePath = `${NOIR_FIXTURES_DIRECTORY}/${hardFork}/${fixtureName}`;

    await mkdir(modulePath, { recursive: true });

    await writeFile(join(modulePath, 'header.nr'), createHeaderFixture(block));
    await writeFile(join(modulePath, 'account.nr'), createAccountFixture(stateProof));
    await writeFile(join(modulePath, 'state_proof.nr'), createStateProofFixture(stateProof));
    if (storageKeys) {
      await writeFile(
        join(modulePath, 'storage_proof.nr'),
        createStorageProofFixture(stateProof.storageHash, stateProof.storageProof)
      );
    }

    const fixtureModules = ['header', 'account', 'state_proof'];
    if (storageKeys) {
      fixtureModules.push('storage_proof');
    }

    const importFixtureModules = fixtureModules.map((name) => `mod ${name};`).join('\n') + '\n';
    await writeFile(`${modulePath}.nr`, importFixtureModules);

    hardforkModule += `mod ${fixtureName};\n`;
  }

  await writeFile(hardforkModuleFile, hardforkModule);
}

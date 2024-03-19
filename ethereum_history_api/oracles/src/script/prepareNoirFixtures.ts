import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { createClient } from '../ethereum/client.js';
import { createHeaderFixture } from './noir_fixtures/header.js';
import { createStateProofFixture } from './noir_fixtures/state_proof.js';
import { createAccountFixture } from './noir_fixtures/account.js';
import { createStorageProofFixture } from './noir_fixtures/storage_proof.js';
import { createReceiptProofFixture } from './noir_fixtures/receipt_proof.js';
import { FIXTURES } from '../fixtures/config.js';
import { getReceiptProof } from '../ethereum/receiptProof.js';

const NOIR_FIXTURES_DIRECTORY = '../circuits/lib/src/fixtures';
await rm(NOIR_FIXTURES_DIRECTORY, { recursive: true, force: true });

for (const chain in FIXTURES) {
  const client = createClient.get(chain)!();

  let chainModule = ``;
  const chainModuleFile = `${NOIR_FIXTURES_DIRECTORY}/${chain}.nr`;
  for (const hardFork in FIXTURES[chain]) {
    let hardforkModule = ``;
    const hardforkModuleFile = `${NOIR_FIXTURES_DIRECTORY}/${chain}/${hardFork}.nr`;

    for (const fixtureName in FIXTURES[chain][hardFork]) {
      const { blockNumber, address, storageKeys, transactionHashes } = FIXTURES[chain][hardFork][fixtureName];
      const modulePath = `${NOIR_FIXTURES_DIRECTORY}/${chain}/${hardFork}/${fixtureName}`;
      await mkdir(modulePath, { recursive: true });
      const fixtureModules: string[] = [];

      const block = await client.getBlock({ blockNumber });
      await writeFile(join(modulePath, 'header.nr'), createHeaderFixture(block));
      fixtureModules.push('header');

      if (address) {
        const stateProof = await client.getProof({
          address,
          storageKeys: storageKeys ?? [],
          blockNumber
        });

        await writeFile(join(modulePath, 'account.nr'), createAccountFixture(stateProof));
        await writeFile(join(modulePath, 'state_proof.nr'), createStateProofFixture(stateProof));
        fixtureModules.push('account', 'state_proof');
        if (storageKeys) {
          await writeFile(join(modulePath, 'storage_proof.nr'), createStorageProofFixture(stateProof.storageProof));
          fixtureModules.push('storage_proof');
        }

        if (transactionHashes) {
          const transactionIndexes = transactionHashes.map((hash) => block.transactions.indexOf(hash));
          const receiptProofs = await Promise.all(
            transactionIndexes.map(async (txIdx) => await getReceiptProof(client, blockNumber, txIdx))
          );

          await writeFile(join(modulePath, 'receipt_proof.nr'), createReceiptProofFixture(receiptProofs));
          fixtureModules.push('receipt_proof');
        }
      }

      const declareFixtureModules = fixtureModules.map((name) => `mod ${name};`).join('\n') + '\n';
      await writeFile(`${modulePath}.nr`, declareFixtureModules);

      hardforkModule += `mod ${fixtureName};\n`;
    }
    chainModule += `mod ${hardFork};\n`;
    await writeFile(hardforkModuleFile, hardforkModule);
  }
  await writeFile(chainModuleFile, chainModule);
}

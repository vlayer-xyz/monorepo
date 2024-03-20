import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { AlchemyClient, createClient } from '../ethereum/client.js';
import { createHeaderFixture } from './noir_fixtures/header.js';
import { createStateProofFixture } from './noir_fixtures/state_proof.js';
import { createAccountFixture } from './noir_fixtures/account.js';
import { createStorageProofFixture } from './noir_fixtures/storage_proof.js';
import { createReceiptProofFixture } from './noir_fixtures/receipt_proof.js';
import { FIXTURES } from '../fixtures/config.js';
import { getReceiptProof } from '../ethereum/receiptProof.js';
import { assert } from '../main.js';
import { Block } from '../ethereum/blockHeader.js';
import { Hash } from 'viem';

const NOIR_FIXTURES_DIRECTORY = '../circuits/lib/src/fixtures';
await rm(NOIR_FIXTURES_DIRECTORY, { recursive: true, force: true });

const TX_NOT_FOUND = -1;

for (const chain in FIXTURES) {
  const client = createClient.get(chain)!();

  let chainModule = ``;
  const chainModuleFile = `${NOIR_FIXTURES_DIRECTORY}/${chain}.nr`;
  for (const hardFork in FIXTURES[chain]) {
    let hardforkModule = ``;
    const hardforkModuleFile = `${NOIR_FIXTURES_DIRECTORY}/${chain}/${hardFork}.nr`;

    for (const fixtureName in FIXTURES[chain][hardFork]) {
      const { blockNumber, address, storageKeys, transactionHash } = FIXTURES[chain][hardFork][fixtureName];
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

        if (transactionHash) {
          await prepareReceiptProofFixture(client, block, transactionHash, modulePath);
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

async function prepareReceiptProofFixture(client: AlchemyClient, block: Block, txHash: Hash, modulePath: string) {
  const txIdx = block.transactions.indexOf(txHash);
  assert(txIdx !== TX_NOT_FOUND, `Transaction with hash: ${txHash} not found in block #${block.number}`);

  const receiptProof = await getReceiptProof(client, block.number, txIdx);
  await writeFile(join(modulePath, 'receipt_proof.nr'), createReceiptProofFixture(receiptProof));
}

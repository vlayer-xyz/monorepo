import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { Hex } from 'viem';
import { Block } from '../ethereum/blockHeader.js';
import { MultiChainClient, getChainByName } from '../ethereum/client.js';
import { getReceiptProof } from '../ethereum/receiptProof.js';
import { HISTORY_API_FIXTURES } from '../fixtures/historyAPIConfig.js';
import { assert } from '../main.js';
import { createAccountFixture } from './noir_fixtures/account.js';
import { createHeaderFixture } from './noir_fixtures/header.js';
import { createTransactionFixture } from './noir_fixtures/transaction.js';
import { getTxProof } from '../ethereum/txProof.js';
import { createReceiptFixture } from './noir_fixtures/receipt.js';
import { createLogFixture } from './noir_fixtures/log.js';
import { createReceiptProofFixture } from './noir_fixtures/receipt_proof.js';
import { createTransactionProofFixture } from './noir_fixtures/transaction_proof.js';
import { createStateProofFixture } from './noir_fixtures/state_proof.js';
import { createStorageProofFixture } from './noir_fixtures/storage_proof.js';
import { createStorageFixture } from './noir_fixtures/storage.js';

const INDEX_NOT_FOUND = -1;

const NOIR_FIXTURES_DIRECTORY = '../circuits/lib/src/fixtures';

const multiChainClient = MultiChainClient.from_env();

for (const chain in HISTORY_API_FIXTURES) {
  const chainDirectory = `${NOIR_FIXTURES_DIRECTORY}/${chain}`;
  const chainModuleFile = `${NOIR_FIXTURES_DIRECTORY}/${chain}.nr`;
  await rm(chainDirectory, { recursive: true, force: true });
  await rm(chainModuleFile, { force: true });

  const client = multiChainClient.getClient(getChainByName(chain).id);

  let chainModule = ``;
  for (const hardFork in HISTORY_API_FIXTURES[chain]) {
    let hardforkModule = ``;
    const hardforkModuleFile = `${NOIR_FIXTURES_DIRECTORY}/${chain}/${hardFork}.nr`;

    for (const fixtureName in HISTORY_API_FIXTURES[chain][hardFork]) {
      const { blockNumber, address, storageKeys, transactionHash, skipHeader, logIdx } =
        HISTORY_API_FIXTURES[chain][hardFork][fixtureName];
      const modulePath = `${NOIR_FIXTURES_DIRECTORY}/${chain}/${hardFork}/${fixtureName}`;
      await mkdir(modulePath, { recursive: true });
      const fixtureModules: string[] = [];

      const block = await client.getBlock({ blockNumber });

      if (!(skipHeader ?? false)) {
        await writeFile(join(modulePath, 'header.nr'), createHeaderFixture(block));
        fixtureModules.push('header');
      }

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
          await writeFile(join(modulePath, 'storage.nr'), createStorageFixture(stateProof));
          await writeFile(join(modulePath, 'storage_proof.nr'), createStorageProofFixture(stateProof.storageProof));
          fixtureModules.push('storage', 'storage_proof');
        }
      }

      if (transactionHash) {
        const blockWithTransactions = await client.getBlock({ blockNumber, includeTransactions: true });
        const txIdx = getTxIdx(block, transactionHash);
        const blockReceipts = await client.getTransactionReceipts({ blockNumber });
        const receipt = blockReceipts[txIdx];
        const txReceiptProof = await getReceiptProof(block, blockReceipts, txIdx);
        await writeFile(join(modulePath, 'receipt.nr'), createReceiptFixture(receipt));
        await writeFile(join(modulePath, 'receipt_proof.nr'), createReceiptProofFixture(txReceiptProof));
        fixtureModules.push('receipt_proof', 'receipt');

        const tx = await client.getTransaction({ hash: transactionHash });
        await writeFile(join(modulePath, 'transaction.nr'), createTransactionFixture(tx));
        fixtureModules.push('transaction');

        const txProof = await getTxProof(
          blockWithTransactions.transactions,
          blockWithTransactions.transactionsRoot,
          txIdx
        );
        await writeFile(join(modulePath, 'transaction_proof.nr'), createTransactionProofFixture(txProof));
        fixtureModules.push('transaction_proof');
        if (logIdx !== undefined) {
          const log = receipt.logs[logIdx];
          await writeFile(join(modulePath, 'log.nr'), createLogFixture(log, logIdx));
          fixtureModules.push('log');
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

function getTxIdx(block: Block, transactionHash: Hex): number {
  const txIdx = block.transactions.indexOf(transactionHash);
  assert(txIdx !== INDEX_NOT_FOUND, `Transaction with hash: ${transactionHash} not found in block #${block.number}`);
  return txIdx;
}

import { join } from 'path';
import { GetProofReturnType, Hash, Transaction, TransactionReceipt } from 'viem';
import { FIXTURES, JS_FIXTURES_DIRECTORY } from './fixtures/config.js';
import { BaseFixture } from './fixtures/types.js';
import { readObject } from './util/file.js';
import type { Block } from './ethereum/blockHeader.js';

export async function loadFixture<T>(chain: string, hardFork: string, fixtureName: string, method: string): Promise<T> {
  const fileName = join(JS_FIXTURES_DIRECTORY, chain, hardFork, fixtureName, `${method}.json`);
  const fixture = await readObject<BaseFixture<T>>(fileName);
  return fixture.result;
}

export async function loadBlockFixture<TIncludeTransactions extends boolean = false>(
  chain: string,
  hardFork: string,
  fixtureName: string,
  includeTransactions: TIncludeTransactions
): Promise<Block<TIncludeTransactions>> {
  const blockNumber = FIXTURES[chain][hardFork][fixtureName].blockNumber;
  if (includeTransactions) {
    return loadFixture(chain, hardFork, fixtureName, `eth_getBlockByHash_${blockNumber}_includeTransactions`);
  } else {
    return loadFixture(chain, hardFork, fixtureName, `eth_getBlockByHash_${blockNumber}`);
  }
}

export async function loadProofFixture(
  chain: string,
  hardFork: string,
  fixtureName: string
): Promise<GetProofReturnType> {
  const blockNumber = FIXTURES[chain][hardFork][fixtureName].blockNumber;
  return loadFixture<GetProofReturnType>(chain, hardFork, fixtureName, `eth_getProof_${blockNumber}`);
}

export async function loadTxFixture(
  chain: string,
  hardFork: string,
  fixtureName: string,
  txHash: Hash
): Promise<Transaction> {
  const blockWithTransactions = await loadBlockFixture(chain, hardFork, fixtureName, true);
  const tx = blockWithTransactions.transactions.find((tx) => tx.hash === txHash);
  if (!tx) {
    throw new Error(`Transaction ${txHash} not found in fixture ${fixtureName}`);
  }
  return tx;
}

export async function loadReceiptFixture(
  chain: string,
  hardFork: string,
  fixtureName: string,
  txHash: Hash
): Promise<TransactionReceipt> {
  const blockNumber = FIXTURES[chain][hardFork][fixtureName].blockNumber;
  const blockReceipts = await loadFixture<TransactionReceipt[]>(
    chain,
    hardFork,
    fixtureName,
    `alchemy_getTransactionReceipts_${blockNumber}`
  );
  const txReceipt = blockReceipts.find((receipt) => receipt.transactionHash === txHash);
  if (!txReceipt) {
    throw new Error(`Transaction receipt  for ${txHash} not found in fixture ${fixtureName}`);
  }
  return txReceipt;
}

export async function loadBlockFixtures<TIncludeTransactions extends boolean = false>(
  includeTransactions: TIncludeTransactions
): Promise<Block<TIncludeTransactions>[]> {
  const blocks: Block<TIncludeTransactions>[] = [];
  for (const chain in FIXTURES) {
    for (const hardFork in FIXTURES[chain]) {
      for (const fixtureName in FIXTURES[chain][hardFork]) {
        blocks.push(await loadBlockFixture(chain, hardFork, fixtureName, includeTransactions));
      }
    }
  }
  return blocks;
}

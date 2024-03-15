import { join } from 'path';
import { GetProofReturnType, Hash, TransactionReceipt } from 'viem';
import { FIXTURES, JS_FIXTURES_DIRECTORY } from './fixtures/config.js';
import { BaseFixture } from './fixtures/types.js';
import { readObject } from './util/file.js';
import type { Block } from './ethereum/blockHeader.js';

export async function loadFixture<T>(chain: string, hardFork: string, fixtureName: string, method: string): Promise<T> {
  const fileName = join(JS_FIXTURES_DIRECTORY, chain, hardFork, fixtureName, `${method}.json`);
  const fixture = await readObject<BaseFixture<T>>(fileName);
  return fixture.result;
}

export async function loadBlockFixture(
  chain: string,
  hardFork: string,
  fixtureName: string,
  includeTransactions = false
): Promise<Block> {
  const blockNumber = FIXTURES[chain][hardFork][fixtureName].blockNumber;
  if (includeTransactions) {
    return loadFixture<Block>(chain, hardFork, fixtureName, `eth_getBlockByHash_${blockNumber}_includeTransactions`);
  } else {
    return loadFixture<Block>(chain, hardFork, fixtureName, `eth_getBlockByHash_${blockNumber}`);
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

export async function loadBlockFixtures(): Promise<Block[]> {
  const blocks: Block[] = [];
  for (const chain in FIXTURES) {
    for (const hardFork in FIXTURES[chain]) {
      for (const fixtureName in FIXTURES[chain][hardFork]) {
        blocks.push(await loadBlockFixture(chain, hardFork, fixtureName));
      }
    }
  }
  return blocks;
}

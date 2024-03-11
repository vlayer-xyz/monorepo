import { join } from 'path';
import { GetBlockReturnType, GetProofReturnType } from 'viem';
import { FIXTURES, JS_FIXTURES_DIRECTORY } from './fixtures/config.js';
import { BaseFixture } from './fixtures/types.js';
import { readObject } from './util/file.js';

export async function loadFixture<T>(chain: string, hardFork: string, fixtureName: string, method: string): Promise<T> {
  const fileName = join(JS_FIXTURES_DIRECTORY, chain, hardFork, fixtureName, `${method}.json`);
  const fixture = await readObject<BaseFixture<T>>(fileName);
  return fixture.result;
}

export async function loadBlockFixture(
  chain: string,
  hardFork: string,
  fixtureName: string
): Promise<GetBlockReturnType> {
  return loadFixture<GetBlockReturnType>(chain, hardFork, fixtureName, 'eth_getBlockByHash');
}

export async function loadProofFixture(
  chain: string,
  hardFork: string,
  fixtureName: string
): Promise<GetProofReturnType> {
  return loadFixture<GetProofReturnType>(chain, hardFork, fixtureName, 'eth_getProof');
}

export async function loadBlockFixtures(): Promise<GetBlockReturnType[]> {
  const blocks: GetBlockReturnType[] = [];
  for (const chain of ['mainnet']) {
    // TO BE CHANGED ASAP (next PR) TO: in FIXTURES) {
    for (const hardFork in FIXTURES[chain]) {
      for (const fixtureName in FIXTURES[chain][hardFork]) {
        blocks.push(await loadBlockFixture(chain, hardFork, fixtureName));
      }
    }
  }
  return blocks;
}

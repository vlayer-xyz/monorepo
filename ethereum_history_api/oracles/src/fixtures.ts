import { join } from 'path';
import { GetBlockReturnType, GetProofReturnType } from 'viem';
import { FIXTURES, JS_FIXTURES_DIRECTORY } from './fixtures/config.js';
import { BaseFixture } from './fixtures/types.js';
import { readObject } from './util/file.js';

export async function loadFixture<T>(hardFork: string, fixtureName: string, method: string): Promise<T> {
  const fileName = join(JS_FIXTURES_DIRECTORY, hardFork, fixtureName, `${method}.json`);
  const fixture = await readObject<BaseFixture<T>>(fileName);
  return fixture.result;
}

export async function loadBlockFixture(hardFork: string, fixtureName: string): Promise<GetBlockReturnType> {
  return loadFixture<GetBlockReturnType>(hardFork, fixtureName, 'eth_getBlockByHash');
}

export async function loadProofFixture(hardFork: string, fixtureName: string): Promise<GetProofReturnType> {
  return loadFixture<GetProofReturnType>(hardFork, fixtureName, 'eth_getProof');
}

export async function loadBlockFixtures(): Promise<GetBlockReturnType[]> {
  const blocks: GetBlockReturnType[] = [];
  for (const hardFork in FIXTURES) {
    for (const fixtureName in FIXTURES[hardFork]) {
      blocks.push(await loadBlockFixture(hardFork, fixtureName));
    }
  }
  return blocks;
}

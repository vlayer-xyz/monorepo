import { join } from 'path';
import { FIXTURES, JS_FIXTURES_DIRECTORY } from './config.js';
import { GetBlockReturnType } from 'viem';
import { readObject } from '../util/file.js';
import { GetBlockFixture } from './types.js';

export async function loadBlockFixtures(): Promise<GetBlockReturnType[]> {
  const blocks: GetBlockReturnType[] = [];
  for (const hardFork in FIXTURES) {
    for (const fixtureName in FIXTURES[hardFork]) {
      const fileName = join(JS_FIXTURES_DIRECTORY, hardFork, fixtureName, 'eth_getBlockByHash.json');
      const blockFixture = await readObject<GetBlockFixture>(fileName);
      blocks.push(blockFixture.result);
    }
  }
  return blocks;
}
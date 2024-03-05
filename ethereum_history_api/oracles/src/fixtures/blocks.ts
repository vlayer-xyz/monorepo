import { join } from 'path';
import { FIXTURES, JS_FIXTURES_DIRECTORY } from './config.js';
import { GetBlockReturnType } from 'viem';
import { readObject } from '../util/file.js';
import { GetBlockFixture } from './types.js';

export async function getBlockFixtures(): Promise<GetBlockReturnType[]> {
  const blocks: GetBlockReturnType[] = [];
  for (const hardFork in FIXTURES) {
    for (const fixtureName in FIXTURES[hardFork]) {
      const modulePath = `${JS_FIXTURES_DIRECTORY}/${hardFork}/${fixtureName}`;
      const fileName = join(modulePath, 'eth_getBlockByHash.json');
      const blockFixture = await readObject<GetBlockFixture>(fileName);
      blocks.push(blockFixture.result);
    }
  }
  return blocks;
}

import { GetBlockReturnType } from 'viem';
import { loadBlockFixture } from '../fixtures.js';
import { FIXTURES } from './config.js';

export async function loadBlockFixtures(): Promise<GetBlockReturnType[]> {
  const blocks: GetBlockReturnType[] = [];
  for (const hardFork in FIXTURES) {
    for (const fixtureName in FIXTURES[hardFork]) {
      blocks.push(await loadBlockFixture(hardFork, fixtureName));
    }
  }
  return blocks;
}

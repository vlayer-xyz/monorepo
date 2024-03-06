import { join } from 'path';
import { GetBlockReturnType, GetProofReturnType } from 'viem';
import { JS_FIXTURES_DIRECTORY } from './fixtures/config.js';
import { GetBlockFixture, GetProofFixture } from './fixtures/types.js';
import { readObject } from './util/file.js';

export async function loadBlockFixture(hardFork: string, fixtureName: string): Promise<GetBlockReturnType> {
  const fileName = join(JS_FIXTURES_DIRECTORY, hardFork, fixtureName, 'eth_getBlockByHash.json');
  const getBlockFixture = await readObject<GetBlockFixture>(fileName);
  return getBlockFixture.result;
}

export async function loadProofFixture(hardFork: string, fixtureName: string): Promise<GetProofReturnType> {
  const fileName = join(JS_FIXTURES_DIRECTORY, hardFork, fixtureName, 'eth_getProof.json');
  const getProofFixture = await readObject<GetProofFixture>(fileName);
  return getProofFixture.result;
}

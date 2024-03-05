import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { GetProofParameters, PublicClient } from 'viem';

import { createDefaultClient } from '../ethereum/client.js';
import { FIXTURES, JS_FIXTURES_DIRECTORY } from '../fixtures/config.js';
import { GetBlockFixture, GetProofFixture } from '../fixtures/types.js';
import { writeObject } from '../util/file.js';

async function createBlockFixture(client: PublicClient, blockNumber: bigint): Promise<GetBlockFixture> {
  const block = await client.getBlock({ blockNumber });
  return {
    method: 'eth_getBlockByHash',
    arguments: [blockNumber, false],
    result: block
  };
}

async function createProofFixture(client: PublicClient, parameters: GetProofParameters): Promise<GetProofFixture> {
  const proof = await client.getProof(parameters);
  return {
    method: 'eth_getProof',
    arguments: [parameters.address, parameters.storageKeys, parameters.blockNumber!],
    result: proof
  };
}

export async function prepareJSFixtures(): Promise<void> {
  await rm(JS_FIXTURES_DIRECTORY, { recursive: true, force: true });
  const client = createDefaultClient();
  for (const hardFork in FIXTURES) {
    for (const fixtureName in FIXTURES[hardFork]) {
      const modulePath = `${JS_FIXTURES_DIRECTORY}/${hardFork}/${fixtureName}`;

      await mkdir(modulePath, { recursive: true });
      const { blockNumber, address, storageKeys } = FIXTURES[hardFork][fixtureName];

      const getBlockFixture = await createBlockFixture(client, blockNumber);
      await writeObject(getBlockFixture, join(modulePath, 'eth_getBlockByHash.json'));

      const getProofFixture = await createProofFixture(client, {
        address,
        storageKeys: storageKeys ?? [],
        blockNumber
      });
      await writeObject(getProofFixture, join(modulePath, 'eth_getProof.json'));
    }
  }
}

await prepareJSFixtures();

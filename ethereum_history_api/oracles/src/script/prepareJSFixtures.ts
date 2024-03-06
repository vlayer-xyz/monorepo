import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { GetProofParameters } from 'viem';

import { createDefaultClient } from '../ethereum/client.js';
import { FIXTURES, JS_FIXTURES_DIRECTORY } from '../fixtures/config.js';
import { GetBlockFixture, GetProofFixture } from '../fixtures/types.js';
import { writeObject } from '../util/file.js';
import { RecordingClient, createRecordingClient } from '../ethereum/recordingClient.js';

async function createBlockFixture(client: RecordingClient, blockNumber: bigint): Promise<GetBlockFixture> {
  await client.getBlock({ blockNumber });
  return client.getLastCall() as GetBlockFixture;
}

async function createProofFixture(client: RecordingClient, parameters: GetProofParameters): Promise<GetProofFixture> {
  await client.getProof(parameters);
  return client.getLastCall() as GetProofFixture;
}

export async function prepareJSFixtures(): Promise<void> {
  await rm(JS_FIXTURES_DIRECTORY, { recursive: true, force: true });
  const client = createRecordingClient(createDefaultClient());
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

import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { GetProofParameters } from 'viem';

import { createClient } from '../ethereum/client.js';
import { FIXTURES, JS_FIXTURES_DIRECTORY } from '../fixtures/config.js';
import { GetBlockFixture, GetProofFixture } from '../fixtures/types.js';
import { writeObject } from '../util/file.js';
import { RecordingClient, createRecordingClient } from '../ethereum/recordingClient.js';
import { last } from '../util/array.js';

async function createBlockFixture<TIncludeTransactions extends boolean>(
  client: RecordingClient,
  blockNumber: bigint,
  includeTransactions = false
): Promise<GetBlockFixture<TIncludeTransactions>> {
  if (includeTransactions) {
    await client.getBlock({ blockNumber, includeTransactions: includeTransactions });
  } else {
    await client.getBlock({ blockNumber }); // It's important for mock client that includeTransactions is undefined and not false
  }
  return last(client.getCalls()) as GetBlockFixture<TIncludeTransactions>;
}

async function createProofFixture(client: RecordingClient, parameters: GetProofParameters): Promise<GetProofFixture> {
  await client.getProof(parameters);
  return last(client.getCalls()) as GetProofFixture;
}

export async function prepareJSFixtures(): Promise<void> {
  await rm(JS_FIXTURES_DIRECTORY, { recursive: true, force: true });
  for (const chain in FIXTURES) {
    const client = createRecordingClient(createClient.get(chain)!());
    for (const hardFork in FIXTURES[chain]) {
      for (const fixtureName in FIXTURES[chain][hardFork]) {
        const modulePath = `${JS_FIXTURES_DIRECTORY}/${chain}/${hardFork}/${fixtureName}`;

        await mkdir(modulePath, { recursive: true });
        const { blockNumber, address, storageKeys } = FIXTURES[chain][hardFork][fixtureName];

        const getBlockFixture = await createBlockFixture(client, blockNumber);
        await writeObject(getBlockFixture, join(modulePath, `eth_getBlockByHash_${blockNumber}.json`));

        const getBlockFixtureWithTransactions = await createBlockFixture(client, blockNumber, true);
        await writeObject(
          getBlockFixtureWithTransactions,
          join(modulePath, `eth_getBlockByHash_${blockNumber}_includeTransactions.json`)
        );

        const getProofFixture = await createProofFixture(client, {
          address,
          storageKeys: storageKeys ?? [],
          blockNumber
        });
        await writeObject(getProofFixture, join(modulePath, `eth_getProof_${blockNumber}.json`));
      }
    }
  }
}

await prepareJSFixtures();

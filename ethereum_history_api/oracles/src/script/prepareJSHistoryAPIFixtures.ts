import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { GetProofParameters } from 'viem';

import { MultiChainClient, getChainByName } from '../ethereum/client.js';
import { HISTORY_API_FIXTURES, JS_FIXTURES_DIRECTORY } from '../fixtures/historyAPIConfig.js';
import { GetBlockFixture, GetTransactionReceiptsFixture, GetProofFixture } from '../fixtures/types.js';
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

const multiChainClient = MultiChainClient.from_env();

async function createReceiptsFixture(
  client: RecordingClient,
  blockNumber: bigint
): Promise<GetTransactionReceiptsFixture> {
  await client.getTransactionReceipts({ blockNumber });
  return last(client.getCalls()) as GetTransactionReceiptsFixture;
}

export async function prepareJSFixtures(): Promise<void> {
  await rm(JS_FIXTURES_DIRECTORY, { recursive: true, force: true });
  for (const chain in HISTORY_API_FIXTURES) {
    const client = createRecordingClient(multiChainClient.getClient(getChainByName(chain).id));
    for (const hardFork in HISTORY_API_FIXTURES[chain]) {
      for (const fixtureName in HISTORY_API_FIXTURES[chain][hardFork]) {
        const modulePath = `${JS_FIXTURES_DIRECTORY}/${chain}/${hardFork}/${fixtureName}`;

        await mkdir(modulePath, { recursive: true });
        const { blockNumber, address, storageKeys } = HISTORY_API_FIXTURES[chain][hardFork][fixtureName];

        const getBlockFixture = await createBlockFixture(client, blockNumber);
        await writeObject(getBlockFixture, join(modulePath, `eth_getBlockByHash_${blockNumber}.json`));

        const getBlockFixtureWithTransactions = await createBlockFixture(client, blockNumber, true);
        await writeObject(
          getBlockFixtureWithTransactions,
          join(modulePath, `eth_getBlockByHash_${blockNumber}_includeTransactions.json`)
        );

        if (address) {
          const getProofFixture = await createProofFixture(client, {
            address,
            storageKeys: storageKeys ?? [],
            blockNumber
          });
          await writeObject(getProofFixture, join(modulePath, `eth_getProof_${blockNumber}.json`));
        }

        const getReceiptsFixture = await createReceiptsFixture(client, blockNumber);
        await writeObject(getReceiptsFixture, join(modulePath, `alchemy_getTransactionReceipts_${blockNumber}.json`));
      }
    }
  }
}

await prepareJSFixtures();

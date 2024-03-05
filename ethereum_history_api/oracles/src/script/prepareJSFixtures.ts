import { mkdir, rm, writeFile } from 'fs/promises';
import prettier from 'prettier';
import { join } from 'path';
import { GetProofParameters } from 'viem';

import { createDefaultClient } from '../ethereum/client.js';
import { stringify } from '../util/json-bigint.js';
import { FIXTURES } from '../fixtures/config.js';

const OUT_DIR = 'new_fixtures';
await rm(OUT_DIR, { recursive: true, force: true });
const INDENTATION = 2;

async function prettierFormatJSON(data: string): Promise<string> {
  const options = await prettier.resolveConfig('./');
  return prettier.format(data, { parser: 'json', tabWidth: INDENTATION, ...options });
}

async function createBlockFixture(blockNumber: bigint, modulePath: string): Promise<void> {
  const block = await client.getBlock({ blockNumber });
  const getBlockFixture = {
    method: 'eth_getBlockByHash',
    arguments: [blockNumber, false],
    result: block
  };
  const formattedBlockDataFixture = await prettierFormatJSON(stringify(getBlockFixture));
  await writeFile(join(modulePath, 'eth_getBlockByHash.json'), formattedBlockDataFixture);
}

async function createProofFixture(parameters: GetProofParameters, modulePath: string): Promise<void> {
  const proof = await client.getProof(parameters);
  const getProofFixture = {
    method: 'eth_getProof',
    arguments: [parameters.address, parameters.storageKeys, parameters.blockNumber],
    result: proof
  };
  const formattedProofDataFixture = await prettierFormatJSON(stringify(getProofFixture));
  await writeFile(join(modulePath, 'eth_getProof.json'), formattedProofDataFixture);
}

const client = createDefaultClient();
for (const hardFork in FIXTURES) {
  for (const fixtureName in FIXTURES[hardFork]) {
    const modulePath = `${OUT_DIR}/${hardFork}/${fixtureName}`;

    await mkdir(modulePath, { recursive: true });
    const { blockNumber, address, storageKeys } = FIXTURES[hardFork][fixtureName];

    await createBlockFixture(blockNumber, modulePath);
    await createProofFixture({ address, storageKeys: storageKeys ?? [], blockNumber }, modulePath);
  }
}

import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { createDefaultClient } from '../ethereum/client.js';
import { createHeaderFixture } from './noir_fixtures/header.js';
import { createStateProofFixture } from './noir_fixtures/state_proof.js';
import { createAccountFixture } from './noir_fixtures/account.js';
import { createStorageProofFixture } from './noir_fixtures/storage_proof.js';

const CIRCLE_USDC_BALANCE_STORAGE_KEY = '0x57d18af793d7300c4ba46d192ec7aa095070dde6c52c687c6d0d92fb8532b305';

const FIXTURES = {
  frontier: {
    first: {
      blockNumber: 1n,
      address: '0x40d45d9d7625d15156c932b771ca7b0527130958'
    }
  },
  london: {
    crypto_punks: {
      blockNumber: 14_194_126n,
      address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
    },
    vitalik_balance: {
      blockNumber: 12_965_000n,
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    }
  },
  paris: {
    usdc: {
      blockNumber: 19_000_000n,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      storageKeys: [CIRCLE_USDC_BALANCE_STORAGE_KEY]
    }
  }
} as {
  [fork: string]: {
    [fixtureName: string]: {
      blockNumber: bigint;
      address: `0x${string}`;
      storageKeys?: `0x${string}`[];
    };
  };
};

const OUT_DIR = '../circuits/lib/src/fixtures';
await rm(OUT_DIR, { recursive: true, force: true });

const client = createDefaultClient();
for (const hardFork in FIXTURES) {
  let hardforkModule = ``;
  const hardforkModuleFile = `${OUT_DIR}/${hardFork}.nr`;

  for (const fixtureName in FIXTURES[hardFork]) {
    const { blockNumber, address, storageKeys } = FIXTURES[hardFork][fixtureName];

    const block = await client.getBlock({ blockNumber });
    const stateProof = await client.getProof({
      address,
      storageKeys: storageKeys || [],
      blockNumber
    });

    const modulePath = `${OUT_DIR}/${hardFork}/${fixtureName}`;

    await mkdir(modulePath, { recursive: true });

    await writeFile(join(modulePath, 'header.nr'), createHeaderFixture(block));
    await writeFile(join(modulePath, 'account.nr'), createAccountFixture(stateProof));
    await writeFile(join(modulePath, 'state_proof.nr'), createStateProofFixture(stateProof));
    if (storageKeys) {
      await writeFile(
        join(modulePath, 'storage_proof.nr'),
        createStorageProofFixture(stateProof.storageHash, stateProof.storageProof)
      );
    }

    const fixtureModules = ['header', 'account', 'state_proof'];
    if (storageKeys) {
      fixtureModules.push('storage_proof');
    }

    const importFixtureModules = fixtureModules.map((name) => `mod ${name};`).join('\n') + '\n';
    await writeFile(`${modulePath}.nr`, importFixtureModules);

    hardforkModule += `mod ${fixtureName};\n`;
  }

  await writeFile(hardforkModuleFile, hardforkModule);
}

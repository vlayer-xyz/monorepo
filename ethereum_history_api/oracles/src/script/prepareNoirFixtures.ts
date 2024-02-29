import { createDefaultClient } from '../ethereum/client.js';
import { writeFile, mkdir, rm } from 'fs/promises';
import { createHeaderFixture } from './noir_fixtures/header.js';
import { createStateProofFixture } from './noir_fixtures/state_proof.js';
import { createAccountFixture } from './noir_fixtures/account.js';
import { createStorageProofFixture } from './noir_fixtures/storage_proof.js';
import { assert } from '../util/assert.js';

const USDC_TOKEN_CONTRACT_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const CIRCLE_USDC_BALANCE_STORAGE_KEY = '0x57d18af793d7300c4ba46d192ec7aa095070dde6c52c687c6d0d92fb8532b305';

const FIXTURES = {
  frontier: {
    first: {
      blockNumber: 1n,
      address: '0x40d45d9d7625d15156c932b771ca7b0527130958',
      storageKeys: []
    }
  },
  london: {
    crypto_punks: {
      blockNumber: 14_194_126n,
      address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
      storageKeys: []
    },
    vitalik_balance: {
      blockNumber: 12_965_000n,
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      storageKeys: []
    }
  },
  paris: {
    usdc: {
      blockNumber: 19_000_000n,
      address: USDC_TOKEN_CONTRACT_ADDRESS,
      storageKeys: [CIRCLE_USDC_BALANCE_STORAGE_KEY]
    }
  }
} as {
  [fork: string]: {
    [fixtureName: string]: {
      blockNumber: bigint;
      address: `0x${string}`;
      storageKeys: `0x${string}`[];
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
      storageKeys: storageKeys,
      blockNumber
    });

    await mkdir(`${OUT_DIR}/${hardFork}/${fixtureName}`, { recursive: true });

    const headerFixture = await createHeaderFixture(block);
    const headerFile = `${OUT_DIR}/${hardFork}/${fixtureName}/header.nr`;
    await writeFile(headerFile, headerFixture);

    const accountFixture = await createAccountFixture(stateProof);
    const accountFile = `${OUT_DIR}/${hardFork}/${fixtureName}/account.nr`;
    await writeFile(accountFile, accountFixture);

    const stateProofFixture = await createStateProofFixture(stateProof);
    const stateProofFile = `${OUT_DIR}/${hardFork}/${fixtureName}/state_proof.nr`;
    await writeFile(stateProofFile, stateProofFixture);

    const storageProofLength = stateProof.storageProof.length;

    assert(
      storageProofLength == 0 || storageProofLength == 1,
      `Number of storage proofs must be 0 or 1, but was ${storageProofLength}`
    );
    if (stateProof.storageProof.length == 1) {
      const storageProofFixture = await createStorageProofFixture(stateProof.storageProof[0]);
      const storageProofFile = `${OUT_DIR}/${hardFork}/${fixtureName}/storage_proof.nr`;
      await writeFile(storageProofFile, storageProofFixture);
    }

    const fixtureModule = `mod header;
mod account;
mod state_proof;
`;
    const fixtureModuleFile = `${OUT_DIR}/${hardFork}/${fixtureName}.nr`;
    await writeFile(fixtureModuleFile, fixtureModule);

    hardforkModule += `mod ${fixtureName};\n`;
  }

  await writeFile(hardforkModuleFile, hardforkModule);
}

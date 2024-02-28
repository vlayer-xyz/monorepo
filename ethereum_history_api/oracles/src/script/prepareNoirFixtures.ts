import { createDefaultClient } from '../ethereum/client.js';
import { writeFile, mkdir, rm } from 'fs/promises';
import { createHeaderFixture } from './noir_fixtures/header.js';
import { createStateProofFixture } from './noir_fixtures/state_proof.js';
import { createAccountFixture } from './noir_fixtures/account.js';

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
    one_inch: {
      blockNumber: 19_000_000n,
      address: '0x1111111254EEB25477B68fb85Ed929f73A960582'
    }
  }
} as { [fork: string]: { [fixtureName: string]: { blockNumber: bigint; address: `0x${string}` } } };

const OUT_DIR = './out';
const client = createDefaultClient();
for (const hardFork in FIXTURES) {
  let hardforkModule = ``;
  const hardforkModuleFile = `${OUT_DIR}/${hardFork}.nr`;

  for (const fixtureName in FIXTURES[hardFork]) {
    const { blockNumber, address } = FIXTURES[hardFork][fixtureName];

    const block = await client.getBlock({ blockNumber });
    const stateProof = await client.getProof({
      address,
      storageKeys: [],
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

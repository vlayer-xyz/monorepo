import { describe, expect, it } from 'vitest';
import { generateAndVerifyStorageProof, type MainInputs } from '../src/main.js';
import { encodeAddress } from '../src/noir/encode.js';
import { createOracles, type Oracles } from '../src/noir/oracles/oracles.js';
import { AccountWithProof, expectCircuitFail, type FieldsOfType } from './helpers.js';
import { getHeaderOracle } from '../src/noir/oracles/headerOracle.js';
import { alterArray } from '../src/arrays.js';
import { createMockClient } from '../src/ethereum/mockClient.js';
import { ADDRESS } from './ethereum/recordingClient.test.js';
import { getAccountOracle } from '../src/noir/oracles/accountOracles.js';

const defaultTestCircuitInputParams: MainInputs = {
  block_no: 14194126,
  address: encodeAddress(ADDRESS),
  // prettier-ignore
  state_root: ['0xd7', '0x8d', '0x4f', '0x18', '0x2e', '0xbd', '0x7f', '0xd', '0xc8', '0x6c', '0x5b', '0x32', '0x8b',
    '0x73', '0xf9', '0xea', '0x3d', '0xfe', '0x17', '0xee', '0x56', '0xfb', '0xb4', '0x90', '0xd9', '0xb6', '0x7e',
    '0xda', '0xc4', '0x8e', '0x2b', '0x4']
};

describe(
  'e2e',
  async () => {
    async function oracles(): Promise<Oracles> {
      return createOracles(await createMockClient('./test/fixtures/mockClientData.json'))({
        get_account: getAccountOracle,
        get_header: getHeaderOracle
      });
    }

    it('proof successes', async () => {
      expect(await generateAndVerifyStorageProof(defaultTestCircuitInputParams, await oracles())).toEqual(true);
    });

    const arrayKeys: Array<FieldsOfType<AccountWithProof, readonly string[]>> = ['key', 'value', 'proof'];
    arrayKeys.forEach((arrayField) => {
      it.skip(`proof fails: invalid field: ${arrayField}`, async () => {
        await expectCircuitFail(
          generateAndVerifyStorageProof(
            defaultTestCircuitInputParams
            // await oracles({
            //   ...accountWithProofJSON,
            //   [arrayField]: alterArray(accountWithProofJSON[arrayField])
            // })
          )
        );
      });
    });

    it('proof fails: invalid state root', async () => {
      const inputParams = {
        ...defaultTestCircuitInputParams,
        state_root: alterArray(defaultTestCircuitInputParams.state_root)
      };
      await expectCircuitFail(generateAndVerifyStorageProof(inputParams, await oracles()));
    });
  },
  {
    timeout: 20000
  }
);

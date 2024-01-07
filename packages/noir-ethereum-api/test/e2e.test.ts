import { type Hex } from 'viem';
import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultClient } from '../src/ethereum/client.js';
import { generateAndVerifyStorageProof } from '../src/main.js';
import { encodeAddress } from '../src/noir/encode.js';
import { serializeAccountWithProof } from '../src/noir/oracles/accountOracles.js';
import { type Oracle, type Oracles, createOracles } from '../src/noir/oracles/oracles.js';
import accountWithProof from './fixtures/accountWithProof.json';
import { expectCircuitFail } from './helpers.js';
import { blockHeaders } from './fixtures/blockHeader.json';
import { encodeBlockHeaderPartial } from '../src/noir/oracles/headerOracle.js';
import { type BlockHeader } from '../src/ethereum/blockHeader.js';

const defaultTestCircuitInputParams = {
  block_no: 0,
  address: encodeAddress(0n)
};

function incHexByte(hexByte: string): Hex {
  const newByte = ((parseInt(hexByte) + 1) % 256).toString(16);
  return `0x${newByte}`;
}

function alterArray(array: string[]): void {
  array[0] = incHexByte(array[0]);
}

describe('e2e', () => {
  let getAccount: Oracle;
  let getHeader: Oracle;
  let oracles: Oracles;

  beforeEach(async() => {
    getAccount = async() => serializeAccountWithProof(accountWithProof);
    getHeader = async() => encodeBlockHeaderPartial(blockHeaders[1].header as BlockHeader);
    oracles = createOracles(createDefaultClient())({ get_account: getAccount, get_header: getHeader });
  });

  it('proof successes', async() => {
    expect(await generateAndVerifyStorageProof(defaultTestCircuitInputParams, oracles)).toEqual(true);
  });

  it('proof fails: invalid storage proof', async() => {
    alterArray(accountWithProof.proof);
    await expectCircuitFail(generateAndVerifyStorageProof(defaultTestCircuitInputParams, oracles));
  });

  it('proof fails: invalid address', async() => {
    alterArray(accountWithProof.key);
    await expectCircuitFail(generateAndVerifyStorageProof(defaultTestCircuitInputParams, oracles));
  });

  it('proof fails: invalid account state', async() => {
    alterArray(accountWithProof.value);
    await expectCircuitFail(generateAndVerifyStorageProof(defaultTestCircuitInputParams, oracles));
  });

  it('proof fails: invalid state root', async() => {
    alterArray(accountWithProof.stateRoot);
    await expectCircuitFail(generateAndVerifyStorageProof(defaultTestCircuitInputParams, oracles));
  });
}, {
  timeout: 20000
});

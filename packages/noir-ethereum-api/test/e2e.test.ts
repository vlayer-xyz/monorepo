import { describe, expect, it } from 'vitest';
import { createDefaultClient } from '../src/ethereum/client.js';
import { generate_and_verify_simple_proof, MainInputs } from '../src/main.js';
import { encodeAddress } from '../src/noir/encode.js';
import { AccountWithProof, serializeAccountWithProof } from "../src/noir/oracles/accountOracles.js";
import { createOracles } from "../src/noir/oracles/oracles.js";
import accountWithProofJSON from './fixtures/accountWithProof.json';
import { expectCircuitFail, FieldsOfType } from './helpers.js';
import { blockHeaders } from './fixtures/blockHeader.json';
import { encodeBlockHeaderPartial } from '../src/noir/oracles/headerOracle.js';
import { BlockHeader } from '../src/ethereum/blockHeader.js';
import { alterArray } from "../src/arrays.js";

const defaultTestCircuitInputParams: MainInputs = {
  block_no: 0,
  address: encodeAddress(0n),
  state_root: [
    "0xd7", "0x8d", "0x4f", "0x18", "0x2e", "0xbd", "0x7f", "0xd", "0xc8", "0x6c", "0x5b", "0x32", "0x8b",
    "0x73", "0xf9", "0xea", "0x3d", "0xfe", "0x17", "0xee", "0x56", "0xfb", "0xb4", "0x90", "0xd9", "0xb6",
    "0x7e", "0xda", "0xc4", "0x8e", "0x2b", "0x4"]
};

describe('e2e', () => {

  const oracles = (
    accountWithProof: AccountWithProof = accountWithProofJSON
  ) => createOracles(createDefaultClient())({
    get_account: async () => serializeAccountWithProof(accountWithProof),
    get_header: async () => encodeBlockHeaderPartial(blockHeaders[1].header as BlockHeader)
  });

  it('proof successes', async () => {
    expect(await generate_and_verify_simple_proof(defaultTestCircuitInputParams, oracles())).toEqual(true)
  })

  const arrayKeys: FieldsOfType<AccountWithProof, readonly string[]>[] = ['key', 'value', 'proof'];
  arrayKeys.forEach(arrayField => {
    it(`proof fails: invalid field: ${arrayField}`, async () => {
      expectCircuitFail(generate_and_verify_simple_proof(defaultTestCircuitInputParams,
        oracles({ ...accountWithProofJSON, [arrayField]: alterArray(accountWithProofJSON[arrayField]) })
      ))
    })
  })

  it('proof fails: invalid state root', async () => {
    const inputParams = {
      ...defaultTestCircuitInputParams,
      state_root: alterArray(defaultTestCircuitInputParams.state_root)
    }
    expectCircuitFail(generate_and_verify_simple_proof(inputParams, oracles()))
  })
}, {
  timeout: 20000
})

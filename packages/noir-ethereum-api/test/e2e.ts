import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultClient } from '../src/ethereum/client.js';
import { generate_and_verify_simple_proof } from '../src/main.js';
import { AccountWithProof, serializeAccountWithProof } from "../src/noir/oracles/accountOracles.js";
import { Oracle, Oracles, createOracles } from "../src/noir/oracles/oracles.js";
import { expectCircuitFail } from './helpers.js';
import { encodeBytes32 } from '../src/noir/encode.js';
import accountWithProof from './fixtures/accountWithProof.json';

const defaultTestCircuitInputParams = {
  block_no: 0,
  address: "0x0000000000000000000000000000000000000000"
};

describe('e2e', () => {
  let get_account: Oracle;
  let get_header: Oracle;
  let oracles: Oracles;

  beforeEach(async () => {
    get_account = async () => serializeAccountWithProof(accountWithProof);
    get_header = async () => [encodeBytes32(0n)]
    oracles = createOracles(createDefaultClient())({get_account, get_header});
  });

  it('proof successes', async () => {
    expect(await generate_and_verify_simple_proof(defaultTestCircuitInputParams, oracles)).toEqual(true)
  })

  it('proof fails: invalid storage proof', async () => {
    accountWithProof.proof[0] += 1
    expectCircuitFail(generate_and_verify_simple_proof(defaultTestCircuitInputParams, oracles))
  })

  it('proof fails: invalid address', async () => {
    accountWithProof.key[0] += 1
    expectCircuitFail(generate_and_verify_simple_proof(defaultTestCircuitInputParams, oracles))
  })

  it('proof fails: invalid account state', async () => {
    accountWithProof.value[0] += 1
    expectCircuitFail(generate_and_verify_simple_proof(defaultTestCircuitInputParams, oracles))
  })

  it('proof fails: invalid state root', async () => {
    accountWithProof.stateRoot[0] += 1
    expectCircuitFail(generate_and_verify_simple_proof(defaultTestCircuitInputParams, oracles))
  })
}, {
  timeout: 20000
})

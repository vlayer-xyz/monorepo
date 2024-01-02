import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultClient } from '../src/ethereum/client.js';
import { generate_and_verify_simple_proof } from '../src/main.js';
import { encodeBytes32, encodeAddress } from '../src/noir/encode.js';
import { serializeAccountWithProof } from "../src/noir/oracles/accountOracles.js";
import { Oracle, Oracles, createOracles } from "../src/noir/oracles/oracles.js";
import accountWithProof from './fixtures/accountWithProof.json';
import { expectCircuitFail } from './helpers.js';
import { blockHeaders } from './fixtures/blockHeader.json';
import { encodeBlockHeaderPartial } from '../src/noir/oracles/headerOracle.js';
import { BlockHeader } from '../src/ethereum/blockHeader.js';

const defaultTestCircuitInputParams = {
  block_no: 0,
  address: encodeAddress(0n),
};

describe('e2e', () => {
  let get_account: Oracle;
  let get_header: Oracle;
  let oracles: Oracles;

  beforeEach(async () => {
    get_account = async () => serializeAccountWithProof(accountWithProof);
    get_header = async () => encodeBlockHeaderPartial(blockHeaders[1].header as BlockHeader)
    oracles = createOracles(createDefaultClient())({ get_account, get_header });
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

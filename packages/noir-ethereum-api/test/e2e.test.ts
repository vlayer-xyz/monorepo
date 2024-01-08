import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultClient } from '../src/ethereum/client.js';
import { generate_and_verify_simple_proof } from '../src/main.js';
import { encodeAddress } from '../src/noir/encode.js';
import { serializeAccountWithProof } from "../src/noir/oracles/accountOracles.js";
import { createOracles, Oracle, Oracles } from "../src/noir/oracles/oracles.js";
import accountWithProof from './fixtures/accountWithProof.json';
import { clone, expectCircuitFail } from './helpers.js';
import { blockHeaders } from './fixtures/blockHeader.json';
import { encodeBlockHeaderPartial } from '../src/noir/oracles/headerOracle.js';
import { BlockHeader } from '../src/ethereum/blockHeader.js';
import { InputMap } from "@noir-lang/noir_js";

const defaultTestCircuitInputParams: Readonly<InputMap> = {
  block_no: 0,
  address: encodeAddress(0n),
  state_root: [
    "0xd7", "0x8d", "0x4f", "0x18", "0x2e", "0xbd", "0x7f", "0xd", "0xc8", "0x6c", "0x5b", "0x32", "0x8b",
    "0x73", "0xf9", "0xea", "0x3d", "0xfe", "0x17", "0xee", "0x56", "0xfb", "0xb4", "0x90", "0xd9", "0xb6",
    "0x7e", "0xda", "0xc4", "0x8e", "0x2b", "0x4"]
};

function incHexByte(hexByte: string) {
  const newByte = ((parseInt(hexByte) + 1) % 256).toString(16);
  return '0x' + newByte;
}

function alterArray(array: string[]) {
  array[0] = incHexByte(array[0])
}

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
    alterArray(accountWithProof.proof)
    expectCircuitFail(generate_and_verify_simple_proof(defaultTestCircuitInputParams, oracles))
  })

  it('proof fails: invalid address', async () => {
    alterArray(accountWithProof.key);
    expectCircuitFail(generate_and_verify_simple_proof(defaultTestCircuitInputParams, oracles))
  })

  it('proof fails: invalid account state', async () => {
    alterArray(accountWithProof.value);
    expectCircuitFail(generate_and_verify_simple_proof(defaultTestCircuitInputParams, oracles))
  })

  it('proof fails: invalid state root', async () => {
    const inputParams = clone(defaultTestCircuitInputParams)
    alterArray(inputParams.state_root as string[]);
    expectCircuitFail(generate_and_verify_simple_proof(inputParams, oracles))
  })
}, {
  timeout: 20000
})

import { describe, expect, it } from 'vitest'
import { generate_and_verify_simple_proof } from '../src/main.js'
import { loadAccountWithProof, stubOracles } from './oraclesStub.js';
import { AccountWithProof, Oracles, serializeAccountWithProof } from "../src/noir/oracles.js";

const defaultTestCircuitInputParams = {
  block_no: 0,
  address: "0x0000000000000000000000000000000000000000"
};

describe('generate_and_verify_simple_proof', () => {

  it('proof successes', async () => {
    let accountWithProof: AccountWithProof = loadAccountWithProof('accountWithProof.json');
    const oracles: Oracles = stubOracles({ 'get_account': serializeAccountWithProof(accountWithProof) })
    expect(await generate_and_verify_simple_proof(defaultTestCircuitInputParams, oracles)).toEqual(true)
  })

  it('proof fails: invalid storage proof', async () => {
    let accountWithProof: AccountWithProof = loadAccountWithProof('accountWithProof.json');
    accountWithProof.proof[0] += 1
    const oracles: Oracles = stubOracles({ 'get_account': serializeAccountWithProof(accountWithProof) })
    expect(generate_and_verify_simple_proof(defaultTestCircuitInputParams, oracles)).rejects.toThrow(
      'Circuit execution failed: Error: Failed to solve brillig function, reason: explicit trap hit in brillig',
    );
  })
}, {
  timeout: 20000
})

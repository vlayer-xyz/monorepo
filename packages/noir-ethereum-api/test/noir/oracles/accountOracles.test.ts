import { describe, expect, it } from "vitest";

import proofData from '../../fixtures/eth_getProof_response.json';
import blockData from '../../fixtures/getBlock_response.json';
import accountWithProofData from '../../fixtures/accountWithProof.json';
import {
  AccountWithProof,
  convertEthToNoirProof,
  EthBlock,
  EthProof
} from "../../../src/noir/oracles/accountOracles.js";

describe('accountOracle', () => {
  it('convert', () => {
    const proof: EthProof = proofData as EthProof;
    const block: EthBlock = blockData as EthBlock;
    const expectedAccountWithProofData: AccountWithProof = accountWithProofData as AccountWithProof;

    const accountWithProof = convertEthToNoirProof(block, proof)
    expect(accountWithProof).toBe(expectedAccountWithProofData);
  })
})
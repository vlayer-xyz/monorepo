import { describe, expect, it } from "vitest";

import proofData from '../../fixtures/eth_getProof_response.json';
import blockData from '../../fixtures/getBlock_response.json';
import accountWithProofData from '../../fixtures/accountWithProof.json';
import {
  AccountWithProof, convertAddress,
  convertEthToNoirProof,
  EthBlock,
  EthProof, splitStringInPairs
} from "../../../src/noir/oracles/accountOracles.js";

describe('accountOracle', () => {
  it.skip('convert', () => {
    const proof: EthProof = proofData as EthProof;
    const block: EthBlock = blockData as EthBlock;
    const expectedAccountWithProofData: AccountWithProof = accountWithProofData as AccountWithProof;

    const accountWithProof = convertEthToNoirProof(block, proof)
    expect(accountWithProof).toBe(expectedAccountWithProofData);
  })

  it('test convertAddress', () => {
    expect(convertAddress(proofData.address)).toEqual(accountWithProofData.key)
  })

  it('test splitStringInPairs', () => {
    expect(splitStringInPairs("")).toEqual([]);
    expect(splitStringInPairs("ab")).toEqual(["ab"]);
    expect(splitStringInPairs("abcdef")).toEqual(["ab", "cd", "ef"]);
    expect(() => splitStringInPairs("a")).toThrow('Input length should be even')
  })
})
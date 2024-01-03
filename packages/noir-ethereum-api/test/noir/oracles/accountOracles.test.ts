import { describe, expect, it } from "vitest";

import proofData from '../../fixtures/eth_getProof_response.json';
import blockData from '../../fixtures/getBlock_response.json';
import accountWithProofData from '../../fixtures/accountWithProof.json';
import {
  AccountWithProof, convertAddress,
  convertEthDataToNoirProof,
  EthBlock,
  EthProof
} from "../../../src/noir/oracles/accountOracles.js";

describe('accountOracle', () => {
  it.skip('test convertEthDataToNoirProof', () => {
    const proof: EthProof = proofData as EthProof;
    const block: EthBlock = blockData as EthBlock;
    const expectedAccountWithProofData: AccountWithProof = accountWithProofData as AccountWithProof;

    const accountWithProof = convertEthDataToNoirProof(block, proof)
    expect(accountWithProof).toBe(expectedAccountWithProofData);
  })

  it('test convertAddress', () => {
    expect(convertAddress(proofData.address)).toEqual(accountWithProofData.key)
    expect(convertAddress('0x1234567890123456789012345678901234567890')).toEqual([
      '0x12', '0x34', '0x56', '0x78', '0x90', '0x12', '0x34', '0x56', '0x78', '0x90', '0x12', '0x34', '0x56', '0x78', '0x90', '0x12', '0x34', '0x56', '0x78', '0x90'])

    expect(() => convertAddress("")).toThrow("Address should be 42 bytes long")
    expect(() => convertAddress("0x123456789012345678901234567890123456789")).toThrow("Address should be 42 bytes long")
    expect(() => convertAddress("0x12345678901234567890123456789012345678901")).toThrow("Address should be 42 bytes long")
    expect(() => convertAddress("123456789012345678901234567890123456789012")).toThrow("Address should start with '0x'")
    expect(() => convertAddress("0x123456789012345678901234567890123456789g")).toThrow("Address should be a hexadecimal string")
  })
})
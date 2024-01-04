import { beforeEach, describe, expect, it } from "vitest";
import { encodeAccount } from "../../../src/noir/oracles/accountOracles.js";
import { GetProofReturnType } from "viem";
import { readFile } from "fs/promises";
import { parse } from "json-bigint";


describe('encodeAccount', async () => {

  let proof: GetProofReturnType;

  beforeEach(async () => {
    proof = parse(await readFile('./test/fixtures/eth_getProof_response.json', 'utf-8'));
  });

  it('encode codeHash', async () => {
    expect(encodeAccount(proof).codeHash).toEqual(["0xe2", "0xe7", "0xa7", "0x52", "0x4a", "0x98", "0xce", "0x62", "0x9e", "0xe4", "0x6", "0xc1", "0x5c", "0x51", "0xa6", "0x83", "0xe4", "0x16", "0x7f", "0xb", "0x74", "0xea", "0x23", "0x5", "0x66", "0xdd", "0xec", "0xe7", "0xae", "0x9d", "0x6f", "0xb",]);
  })

  it('encode nonce', async () => {
    expect(encodeAccount(proof).nonce).toEqual("0x1");
  })

  it('encode address', async () => {
    expect(encodeAccount(proof).key).toEqual(["0xb4", "0x7e", "0x3c", "0xd8", "0x37", "0xdd", "0xf8", "0xe4", "0xc5", "0x7f", "0x05", "0xd7", "0x0a", "0xb8", "0x65", "0xde", "0x6e", "0x19", "0x3b", "0xbb"]);
  })

  it('encode depth', async () => {
    expect(encodeAccount(proof).depth).toEqual("0x8");
  })

})
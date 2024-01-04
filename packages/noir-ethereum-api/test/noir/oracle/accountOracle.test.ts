import { describe, expect, it } from "vitest";
import { encodeAccount } from "../../../src/noir/oracles/accountOracles.js";
import { GetProofReturnType } from "viem";
import { readFile } from "fs/promises";
import { parse } from "json-bigint";


describe('encodeAccount', async () => {

  it('encode nonce', async () => {
    const proof: GetProofReturnType = parse(await readFile('./test/fixtures/eth_getProof_response.json', 'utf-8'));
    expect(encodeAccount(proof).nonce).toEqual("0x1");
  })

  it('encode address', async () => {
    const proof: GetProofReturnType = parse(await readFile('./test/fixtures/eth_getProof_response.json', 'utf-8'));
    expect(encodeAccount(proof).key).toEqual(["0xb4", "0x7e", "0x3c", "0xd8", "0x37", "0xdd", "0xf8", "0xe4", "0xc5", "0x7f", "0x05", "0xd7", "0x0a", "0xb8", "0x65", "0xde", "0x6e", "0x19", "0x3b", "0xbb"]);
  })
})
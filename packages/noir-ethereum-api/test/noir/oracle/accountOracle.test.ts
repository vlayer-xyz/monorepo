import { beforeEach, describe, expect, it } from "vitest";
import { encodeAccount } from "../../../src/noir/oracles/accountOracles.js";
import { GetProofReturnType } from "viem";
import { readFile } from "fs/promises";
import { parse } from "json-bigint";
import accountWithProof from "../../fixtures/accountWithProof.json"


describe('encodeAccount', async () => {

  let proof: GetProofReturnType;

  beforeEach(async () => {
    proof = parse(await readFile('./test/fixtures/eth_getProof_response.json', 'utf-8'));
  });

  it('encode codeHash', async () => {
    expect(encodeAccount(proof).codeHash).toEqual(accountWithProof.codeHash);
  })

  it('encode nonce', async () => {
    expect(encodeAccount(proof).nonce).toEqual(accountWithProof.nonce);
  })

  it('encode address', async () => {
    expect(encodeAccount(proof).key).toEqual(accountWithProof.key);
  })

  it('encode account proof', async () => {
    expect(encodeAccount(proof).proof).toEqual(accountWithProof.proof);
  })

  it('encode depth', async () => {
    expect(encodeAccount(proof).depth).toEqual(accountWithProof.depth);
  })

  it('encode value', async () => {
    expect(encodeAccount(proof).value).toEqual(accountWithProof.value);
  })
})
import { beforeEach, describe, expect, it } from 'vitest';
import { encodeAccount } from '../../../src/noir/oracles/accountOracles.js';
import { type GetProofReturnType } from 'viem';
import { readFile } from 'fs/promises';
import JSONBig from 'json-bigint';
import accountWithProof from '../../fixtures/accountWithProof.json';

const parseUseBigInt = JSONBig({ useNativeBigInt: true }).parse;

describe('encodeAccount', async() => {
  let proof: GetProofReturnType;

  beforeEach(async() => {
    proof = parseUseBigInt(await readFile('./test/fixtures/eth_getProof_response.json', 'utf-8'));
  });

  it('encode balance', async() => {
    expect(encodeAccount(proof).balance).toStrictEqual(accountWithProof.balance);
  });

  it('encode codeHash', async() => {
    expect(encodeAccount(proof).codeHash).toStrictEqual(accountWithProof.codeHash);
  });

  it('encode nonce', async() => {
    expect(encodeAccount(proof).nonce).toStrictEqual(accountWithProof.nonce);
  });

  it('encode address', async() => {
    expect(encodeAccount(proof).key).toStrictEqual(accountWithProof.key);
  });

  it('encode value', async() => {
    expect(encodeAccount(proof).value).toStrictEqual(accountWithProof.value);
  });

  it('encode account proof', async() => {
    expect(encodeAccount(proof).proof).toStrictEqual(accountWithProof.proof);
  });

  it('encode depth', async() => {
    expect(encodeAccount(proof).depth).toStrictEqual(accountWithProof.depth);
  });
});

import { describe, expect, it } from 'vitest';
import { encodeAccount } from '../../../src/noir/oracles/accountOracles.js';
import { type GetProofReturnType } from 'viem';
import { readFile } from 'fs/promises';
import JSONBig from 'json-bigint';
import accountWithProof from '../../fixtures/accountWithProof.json';

const parseUseBigInt = JSONBig({ useNativeBigInt: true }).parse;

describe('encodeAccount', async() => {
  it('encode account', async() => {
    const proof: GetProofReturnType = parseUseBigInt(
      await readFile('./test/fixtures/eth_getProof_response.json', 'utf-8')
    );

    expect(encodeAccount(proof)).toStrictEqual(accountWithProof);
  });
});

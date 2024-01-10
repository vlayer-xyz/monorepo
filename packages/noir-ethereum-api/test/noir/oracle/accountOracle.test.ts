import { describe, expect, it } from 'vitest';
import { encodeAccount } from '../../../src/noir/oracles/accountOracles.js';
import { type GetProofReturnType } from 'viem';
import { readFile } from 'fs/promises';
import { parse } from '../../../src/utils/json-bigint.js';
import accountWithProof from '../../fixtures/accountWithProof.json';

describe('encodeAccount', async () => {
  it('encode account', async () => {
    const proof: GetProofReturnType = parse(await readFile('./test/fixtures/eth_getProof_response.json', 'utf-8'));

    expect(encodeAccount(proof)).toStrictEqual(accountWithProof);
  });
});

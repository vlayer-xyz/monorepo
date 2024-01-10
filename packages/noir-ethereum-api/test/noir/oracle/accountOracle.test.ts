import { describe, expect, it } from 'vitest';
import { encodeAccount, parseNoirGetAccountArguments } from '../../../src/noir/oracles/accountOracles.js';
import { type GetProofReturnType } from 'viem';
import { readFile } from 'fs/promises';
import { parse } from '../../../src/utils/json-bigint.js';
import accountWithProof from '../../fixtures/accountWithProof.json';

describe('encodeAccount', async () => {
  it('encode account', async () => {
    const proof: GetProofReturnType = parse(await readFile('./test/fixtures/eth_getProof_response.json', 'utf-8'));

    expect(encodeAccount(proof)).toStrictEqual(accountWithProof);
  });

  it('parseNoirGetAccountArguments success', () => {
    expect(
      parseNoirGetAccountArguments([
        ['0xf'],
        // prettier-ignore
        ['0x30', '0x78', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30',
        '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30',
        '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30', '0x30']
      ])
    ).toStrictEqual({
      blockNumber: 15n,
      address: '0x0000000000000000000000000000000000000000'
    });
  });
});

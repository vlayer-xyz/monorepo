import { describe, expect, it } from 'vitest';
import { encodeAccount, encodeStateProof, parseNoirGetAccountArguments } from './accountOracles.js';
import { type GetProofReturnType } from 'viem';
import { readFile } from 'fs/promises';
import { parse } from '../../util/json-bigint.js';
import account from '../../../test/fixtures/account.json';
import stateProof from '../../../test/fixtures/stateProof.json';
import { serializeAccount, serializeStateProof } from '../../../test/helpers.js';
import { ADDRESS } from '../../ethereum/recordingClient.test.js';

describe('encodeAccount', async () => {
  it('encode account', async () => {
    const proof: GetProofReturnType = parse(await readFile('./test/fixtures/eth_getProof_response.json', 'utf-8'));

    expect(encodeAccount(proof)).toStrictEqual(serializeAccount(account));
    expect(encodeStateProof(proof)).toStrictEqual(serializeStateProof(stateProof));
  });

  it('parseNoirGetAccountArguments success', () => {
    expect(
      parseNoirGetAccountArguments([
        ['0xf'],
        // prettier-ignore
        ["0xb4", "0x7e", "0x3c", "0xd8", "0x37", "0xdd", "0xf8", "0xe4", "0xc5", "0x7f", "0x05", "0xd7", "0x0a", "0xb8",
        "0x65", "0xde", "0x6e", "0x19", "0x3b", "0xbb"]
      ])
    ).toStrictEqual({
      blockNumber: 15n,
      address: ADDRESS
    });
  });
});
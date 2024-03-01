import { describe, expect, it } from 'vitest';
import { encodeAccount, encodeStateProof, parseNoirGetAccountArguments } from './accountOracle.js';
import { type GetProofReturnType } from 'viem';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import { readFile } from 'fs/promises';
import { parse } from '../../util/json-bigint.js';
import account from '../../../fixtures/account.json';
import stateProof from '../../../fixtures/stateProof.json';
import { ADDRESS } from '../../ethereum/recordingClient.test.js';

describe('encodeAccount', async () => {
  it('encode account', async () => {
    const proof: GetProofReturnType = parse(await readFile('./fixtures/eth_getProof_response.json', 'utf-8'));

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

interface Account {
  nonce: string;
  balance: string;
  codeHash: string[];
  storageRoot: string[];
}

interface AccountStateProof {
  key: string[];
  value: string[];
  proof: string[];
  depth: string;
}

function serializeAccount(account: Account): ForeignCallOutput[] {
  return [account.nonce, account.balance, account.storageRoot, account.codeHash];
}

function serializeStateProof(account: AccountStateProof): ForeignCallOutput[] {
  return [account.key, account.value, account.proof, account.depth];
}

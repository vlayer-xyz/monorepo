import { describe, expect, it } from 'vitest';
import { loadProofFixture } from '../../../../historyAPIFixtures.js';
import accountAsFields from './fixtures/accountAsFields.json';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import { encodeAccount, getValue } from './encode.js';
import { Hex } from 'viem';

describe('AccountOracle encode', () => {
  describe('encodeAccount', () => {
    it('encode account', async () => {
      const proofFixture = await loadProofFixture('mainnet', 'paris', 'usdc_circle');
      expect(encodeAccount(proofFixture)).toStrictEqual(serializeAccount(accountAsFields));
    });
  });
});

describe('getValue', () => {
  it('get value from proof', () => {
    const proof = [
      '0xf851a04df3f15dfc229636c27f5ffb66730d904123d3d8d6e3bcf0325df71e13fbecbba04df3f15dfc229636c27f5ffb66730d904123d3d8d6e3bcf0325df71e13fbecbb808080808080808080808080808080',
      '0xe231a01234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    ] as Hex[];
    const value = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    expect(getValue(proof)).toStrictEqual(value);
  });
});

interface AccountAsFields {
  nonce: string;
  balance: string;
  codeHash: string[];
  storageRoot: string[];
}

function serializeAccount(account: AccountAsFields): ForeignCallOutput[] {
  return [account.nonce, account.balance, account.storageRoot, account.codeHash];
}

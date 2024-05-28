import { describe, expect, it } from 'vitest';
import { loadProofFixture } from '../../../../historyAPIFixtures.js';
import accountAsFields from './fixtures/accountAsFields.json';
import stateProofAsFields from './fixtures/stateProofAsFields.json';
import storageProofAsFields from './fixtures/storageProofAsFields.json';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import { encodeAccount, encodeStateProof, encodeStorageProof, getValue } from './encode.js';
import { Hex } from 'viem';

describe('AccountOracle encode', () => {
  describe('encodeAccount', () => {
    it('encode account', async () => {
      const proofFixture = await loadProofFixture('mainnet', 'paris', 'usdc_circle');
      expect(encodeAccount(proofFixture)).toStrictEqual(serializeAccount(accountAsFields));
    });
  });

  describe('encodeStateProof', () => {
    it('encode state proof', async () => {
      const proofFixture = await loadProofFixture('mainnet', 'paris', 'usdc_circle');
      expect(encodeStateProof(proofFixture)).toStrictEqual(serializeStateProof(stateProofAsFields));
    });
  });

  describe('encodeStorageProof', () => {
    it('encode storage proof', async () => {
      const proofFixture = await loadProofFixture('mainnet', 'paris', 'usdc_circle');
      const usdcCircleStorageKey = '0x57d18af793d7300c4ba46d192ec7aa095070dde6c52c687c6d0d92fb8532b305';
      expect(encodeStorageProof(usdcCircleStorageKey, proofFixture.storageProof[0])).toStrictEqual(
        serializeStorageProof(storageProofAsFields)
      );
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

interface ProofAsFields {
  key: string[];
  value: string[];
  proof: string[];
  depth: string;
}

function serializeAccount(account: AccountAsFields): ForeignCallOutput[] {
  return [account.nonce, account.balance, account.storageRoot, account.codeHash];
}

function serializeStateProof(stateProof: ProofAsFields): ForeignCallOutput[] {
  return [stateProof.key, stateProof.value, stateProof.proof, stateProof.depth];
}

function serializeStorageProof(storageProof: ProofAsFields): ForeignCallOutput[] {
  return [storageProof.key, storageProof.value, storageProof.proof, storageProof.depth];
}

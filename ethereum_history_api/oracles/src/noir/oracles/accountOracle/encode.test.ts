import { describe, expect, it } from 'vitest';
import { loadProofFixture } from '../../../fixtures.js';
import accountAsFields from './fixtures/accountAsFields.json';
import stateProofAsFields from './fixtures/stateProofAsFields.json';
import storageProofAsFields from './fixtures/storageProofAsFields.json';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import { encodeAccount, encodeStateProof, encodeStorageProof } from './encode.js';

describe('AccountOracle encode', () => {
  describe('encodeAccount', () => {
    it('encode account', async () => {
      const proofFixture = await loadProofFixture('mainnet', 'paris', 'usdc');
      expect(encodeAccount(proofFixture)).toStrictEqual(serializeAccount(accountAsFields));
    });
  });

  describe('encodeStateProof', () => {
    it('encode state proof', async () => {
      const proofFixture = await loadProofFixture('mainnet', 'paris', 'usdc');
      expect(encodeStateProof(proofFixture)).toStrictEqual(serializeStateProof(stateProofAsFields));
    });
  });

  describe('encodeStorageProof', () => {
    it('encode storage proof', async () => {
      const proofFixture = await loadProofFixture('mainnet', 'paris', 'usdc');
      const usdcCircleStorageKey = '0x57d18af793d7300c4ba46d192ec7aa095070dde6c52c687c6d0d92fb8532b305';
      expect(encodeStorageProof(usdcCircleStorageKey, proofFixture.storageProof[0])).toStrictEqual(
        serializeStorageProof(storageProofAsFields)
      );
    });
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

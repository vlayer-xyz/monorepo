import { describe, expect, it } from 'vitest';
import { loadProofFixture } from '../../../fixtures.js';
import accountAsFields from './fixtures/accountAsFields.json';
import stateProofAsFields from './fixtures/stateProofAsFields.json';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import { encodeAccount, encodeStateProof } from './encode.js';

describe('AccountOracle Codec', () => {
  describe('encodeAccount', () => {
    it('encode account', async () => {
      const proof = await loadProofFixture('mainnet', 'paris', 'usdc');
      expect(encodeAccount(proof)).toStrictEqual(serializeAccount(accountAsFields));
    });
  });

  describe('encodeStateProof', () => {
    it('encode state proof', async () => {
      const proof = await loadProofFixture('mainnet', 'paris', 'usdc');
      expect(encodeStateProof(proof)).toStrictEqual(serializeStateProof(stateProofAsFields));
    });
  });
});

interface AccountAsFields {
  nonce: string;
  balance: string;
  codeHash: string[];
  storageRoot: string[];
}

interface AccountStateProofAsFields {
  key: string[];
  value: string[];
  proof: string[];
  depth: string;
}

function serializeAccount(account: AccountAsFields): ForeignCallOutput[] {
  return [account.nonce, account.balance, account.storageRoot, account.codeHash];
}

function serializeStateProof(account: AccountStateProofAsFields): ForeignCallOutput[] {
  return [account.key, account.value, account.proof, account.depth];
}

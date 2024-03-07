import { describe, expect, it } from 'vitest';
import { loadProofFixture } from '../../../fixtures.js';
import account from './fixtures/account.json';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import { encodeAccount, encodeStateProof } from './codec.js';
import stateProof from './fixtures/stateProof.json';

describe('AccountOracle Codec', () => {
  describe('encodeAccount', () => {
    it('encode account', async () => {
      const proof = await loadProofFixture('paris', 'usdc');
      expect(encodeAccount(proof)).toStrictEqual(serializeAccount(account));
    });
  });

  describe('encodeStateProof', () => {
    it('encode state proof', async () => {
      const proof = await loadProofFixture('paris', 'usdc');
      expect(encodeStateProof(proof)).toStrictEqual(serializeStateProof(stateProof));
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

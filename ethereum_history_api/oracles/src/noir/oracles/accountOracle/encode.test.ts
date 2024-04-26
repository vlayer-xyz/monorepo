import { describe, expect, it } from 'vitest';
import { loadProofFixture } from '../../../historyAPIFixtures.js';
import accountAsFields from './fixtures/accountAsFields.json';
import stateProofAsFields from './fixtures/stateProofAsFields.json';
import storageProofAsFields from './fixtures/storageProofAsFields.json';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import {
  RLP_SHORT_ENTITY_MAX_LEN,
  encodeAccount,
  encodeStateProof,
  encodeStorageProof,
  getRlpHeaderSize
} from './encode.js';
import { ADDRESS_LEN, BYTES32_LEN } from '../common/const.js';

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

describe('getRlpHeaderSize', () => {
  it('should return 1 for short strings', () => {
    expect(getRlpHeaderSize(0)).toBe(1);
    expect(getRlpHeaderSize(1)).toBe(1);
    expect(getRlpHeaderSize(ADDRESS_LEN)).toBe(1);
    expect(getRlpHeaderSize(BYTES32_LEN)).toBe(1);
    expect(getRlpHeaderSize(RLP_SHORT_ENTITY_MAX_LEN)).toBe(1);
  });

  it('should return 2 for long strings where length len is 1', () => {
    expect(getRlpHeaderSize(RLP_SHORT_ENTITY_MAX_LEN + 1)).toBe(2);
    expect(getRlpHeaderSize(2 ** 8 - 1)).toBe(2);
  });

  it('should return 3 for long strings where length len is 2', () => {
    expect(getRlpHeaderSize(256)).toBe(3);
    expect(getRlpHeaderSize(512)).toBe(3);
    expect(getRlpHeaderSize(2 ** 16 - 1)).toBe(3);
  });

  it('should return 4 for long strings where length len is 3', () => {
    expect(getRlpHeaderSize(2 ** 16)).toBe(4);
    expect(getRlpHeaderSize(100_000)).toBe(4);
  });

  it('should return 5 for long strings where length len is 4', () => {
    expect(getRlpHeaderSize(100_000_000)).toBe(5);
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

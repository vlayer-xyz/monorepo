import { ForeignCallOutput } from '@noir-lang/noir_js';
import { GetProofReturnType, Hex, fromRlp, isHex } from 'viem';
import { encodeBytes32, encodeField, encodeHex, encodeProof } from '../common/encode.js';
import { padArray } from '../../../util/array.js';
import { ZERO_PAD_VALUE } from '../common/const.js';
import { assert } from '../../../util/assert.js';
import { accountProofConfig, LEGACY_MAX_ACCOUNT_STATE_LEN } from '../common/proofConfig/account.js';
import { storageProofConfig } from '../common/proofConfig/storage.js';

const RLP_VALUE_INDEX = 1;

export function encodeAccount(ethProof: GetProofReturnType): ForeignCallOutput[] {
  const nonce = encodeField(ethProof.nonce);
  const balance = encodeField(ethProof.balance);
  const storageRoot = encodeHex(ethProof.storageHash);
  const codeHash = encodeHex(ethProof.codeHash);

  return [nonce, balance, storageRoot, codeHash];
}

export function encodeStateProof(ethProof: GetProofReturnType): ForeignCallOutput[] {
  const key = encodeHex(ethProof.address);
  const value = encodeValue(ethProof.accountProof);
  const proof = encodeProof(ethProof.accountProof, accountProofConfig.maxProofLen);
  const depth = encodeField(ethProof.accountProof.length);

  return [key, value, proof, depth];
}

export function getValue(proof: Hex[]): Hex {
  const lastProofEntry = fromRlp(proof[proof.length - 1], 'hex');
  const value = lastProofEntry[RLP_VALUE_INDEX];
  assert(isHex(value), 'value should be of type Hex');
  return value;
}

export function encodeValue(proof: Hex[]): string[] {
  return padArray(encodeHex(getValue(proof)), LEGACY_MAX_ACCOUNT_STATE_LEN, ZERO_PAD_VALUE, 'left');
}

type StorageProof = GetProofReturnType['storageProof'][number];

export function encodeStorageProof(storageKey: Hex, storageProof: StorageProof): ForeignCallOutput[] {
  const key = encodeHex(storageKey);
  const value = encodeBytes32(storageProof.value);
  const proof = encodeProof(storageProof.proof, storageProofConfig.maxProofLen);
  const depth = encodeField(storageProof.proof.length);

  return [key, value, proof, depth];
}

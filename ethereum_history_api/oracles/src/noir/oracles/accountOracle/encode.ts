import { ForeignCallOutput } from '@noir-lang/noir_js';
import { GetProofReturnType, Hex, fromRlp, isHex } from 'viem';
import { encodeField, encodeHex, encodeProof } from '../codec/encode.js';
import { padArray } from '../../../util/array.js';
import { PROOF_ONE_LEVEL_LENGTH, ZERO_PAD_VALUE } from '../codec/const.js';
import { assert } from '../../../util/assert.js';

const MAX_STATE_PROOF_LEVELS = 11;
const MAX_ACCOUNT_STATE_LENGTH = 134;
export const STATE_PROOF_LENGTH = PROOF_ONE_LEVEL_LENGTH * MAX_STATE_PROOF_LEVELS;
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
  const proof = encodeProof(ethProof.accountProof, STATE_PROOF_LENGTH);
  const depth = encodeField(ethProof.accountProof.length);

  return [key, value, proof, depth];
}

export function encodeValue(proof: Hex[]): string[] {
  const lastProofEntry = fromRlp(proof[proof.length - 1], 'hex');
  const value = lastProofEntry[RLP_VALUE_INDEX];
  assert(isHex(value), 'value should be of type Hex');
  return padArray(encodeHex(value), MAX_ACCOUNT_STATE_LENGTH, ZERO_PAD_VALUE, 'left');
}

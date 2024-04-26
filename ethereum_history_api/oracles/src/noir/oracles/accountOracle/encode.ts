import { ForeignCallOutput } from '@noir-lang/noir_js';
import { GetProofReturnType, Hex, fromRlp, isHex } from 'viem';
import { encodeBytes32, encodeField, encodeHex, encodeProof } from '../common/encode.js';
import { padArray } from '../../../util/array.js';
import { ADDRESS_LEN, MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE } from '../common/const.js';
import { assert } from '../../../util/assert.js';
import { BYTE_HEX_LEN } from '../../../util/const.js';

export const RLP_SHORT_ENTITY_MAX_LEN = 55;

export function getRlpHeaderSize(strLen: number): number {
  if (strLen <= RLP_SHORT_ENTITY_MAX_LEN) {
    return 1;
  } else {
    return 1 + Math.ceil(strLen.toString(16).length / BYTE_HEX_LEN);
  }
}

export class AccountCircuitConfig {
  public static readonly MAX_VALUE = 134; // TODO
  private static readonly KEY_LEN = ADDRESS_LEN;
  private static readonly KEY_NIBBLE_LEN = this.KEY_LEN * BYTE_HEX_LEN;
  private static readonly MAX_PREFIXED_KEY_LEN = 1 + this.KEY_LEN;
  public static readonly MAX_PREFIXED_KEY_NIBBLE_LEN = this.MAX_PREFIXED_KEY_LEN * BYTE_HEX_LEN;
  private static readonly KEY_RLP_HEADER_LEN = getRlpHeaderSize(this.MAX_PREFIXED_KEY_LEN);
  private static readonly MAX_VALUE_RLP_HEADER_LEN = getRlpHeaderSize(this.MAX_VALUE);
  private static readonly MAX_LEAF_CONTENT_LEN =
    this.KEY_RLP_HEADER_LEN + this.MAX_PREFIXED_KEY_LEN + this.MAX_VALUE_RLP_HEADER_LEN + this.MAX_VALUE;
  private static readonly MAX_LEAF_RLP_HEADER_LEN = getRlpHeaderSize(this.MAX_LEAF_CONTENT_LEN);
  public static readonly MAX_LEAF_LEN = this.MAX_LEAF_RLP_HEADER_LEN + this.MAX_LEAF_CONTENT_LEN;

  public static readonly MAX_STATE_PROOF_LEVELS = 11;
  public static readonly STATE_PROOF_LEN = MAX_TRIE_NODE_LEN * this.MAX_STATE_PROOF_LEVELS;
}

export const MAX_STORAGE_SLOT_LEN = 32; // Storage slots in Ethereum are 32 bytes.
const MAX_STORAGE_KEY_LEN = 32; // Keys are hashes which are 32 bytes long.
const MAX_STORAGE_KEY_NIBBLE_LEN = MAX_STORAGE_KEY_LEN * BYTE_HEX_LEN;
export const MAX_STORAGE_PREFIXED_KEY_NIBBLE_LEN = MAX_STORAGE_KEY_NIBBLE_LEN + BYTE_HEX_LEN;
// MAX_STORAGE_LEAF_SIZE = MAX_RLP_LIST_HEADER_SIZE + ((MAX_KEY_RLP_HEADER_SIZE + MAX_PREFIXED_KEY_SIZE) + (MAX_STORAGE_HEADER_SIZE + MAX_STORAGE_STATE_LEN))
// MAX_PREFIXED_KEY_SIZE = 1 + 32
// MAX_KEY_RLP_HEADER_SIZE = 1
// MAX_STORAGE_HEADER_SIZE = 1
// MAX_RLP_LIST_HEADER_SIZE = 1 + 1 = 2
// MAX_STORAGE_LEAF_SIZE = 2 + ((1 + (1 + 32)) + (1 + 32)) = 69
export const MAX_STORAGE_LEAF_SIZE = 69;
export const MAX_STORAGE_PROOF_LEVELS = 7;
export const STORAGE_PROOF_LEN = MAX_TRIE_NODE_LEN * MAX_STORAGE_PROOF_LEVELS;

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
  const proof = encodeProof(ethProof.accountProof, AccountCircuitConfig.STATE_PROOF_LEN);
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
  return padArray(encodeHex(getValue(proof)), AccountCircuitConfig.MAX_VALUE, ZERO_PAD_VALUE, 'left');
}

type StorageProof = GetProofReturnType['storageProof'][number];

export function encodeStorageProof(storageKey: Hex, storageProof: StorageProof): ForeignCallOutput[] {
  const key = encodeHex(storageKey);
  const value = encodeBytes32(storageProof.value);
  const proof = encodeProof(storageProof.proof, STORAGE_PROOF_LEN);
  const depth = encodeField(storageProof.proof.length);

  return [key, value, proof, depth];
}

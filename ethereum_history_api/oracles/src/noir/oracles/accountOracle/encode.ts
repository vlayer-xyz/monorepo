import { ForeignCallOutput } from '@noir-lang/noir_js';
import { GetProofReturnType, Hex, fromRlp, isHex } from 'viem';
import { encodeBytes32, encodeField, encodeHex, encodeProof } from '../common/encode.js';
import { padArray } from '../../../util/array.js';
import { ADDRESS_LEN, BYTES32_LEN, MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE } from '../common/const.js';
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
  private static readonly BYTES8_LEN = 8;
  private static readonly MAX_VALUE_CONTENT_LEN =
    getRlpHeaderSize(this.BYTES8_LEN) +
    this.BYTES8_LEN /* Nonce */ +
    getRlpHeaderSize(BYTES32_LEN) +
    BYTES32_LEN /* Balance */ +
    getRlpHeaderSize(BYTES32_LEN) +
    BYTES32_LEN /* Storage root */ +
    getRlpHeaderSize(BYTES32_LEN) +
    BYTES32_LEN; /* Code hash */
  public static readonly MAX_VALUE = getRlpHeaderSize(this.MAX_VALUE_CONTENT_LEN) + this.MAX_VALUE_CONTENT_LEN;
  private static readonly KEY_LEN = ADDRESS_LEN;
  private static readonly PREFIXED_KEY_LEN = 1 + this.KEY_LEN;
  public static readonly PREFIXED_KEY_NIBBLE_LEN = this.PREFIXED_KEY_LEN * BYTE_HEX_LEN;
  private static readonly KEY_RLP_HEADER_LEN = getRlpHeaderSize(this.PREFIXED_KEY_LEN);
  private static readonly MAX_VALUE_RLP_HEADER_LEN = getRlpHeaderSize(this.MAX_VALUE);
  private static readonly MAX_LEAF_CONTENT_LEN =
    this.KEY_RLP_HEADER_LEN + this.PREFIXED_KEY_LEN + this.MAX_VALUE_RLP_HEADER_LEN + this.MAX_VALUE;
  private static readonly MAX_LEAF_RLP_HEADER_LEN = getRlpHeaderSize(this.MAX_LEAF_CONTENT_LEN);
  public static readonly MAX_LEAF_LEN = this.MAX_LEAF_RLP_HEADER_LEN + this.MAX_LEAF_CONTENT_LEN;

  public static readonly MAX_PROOF_LEVELS = 11;
  public static readonly PROOF_LEN = MAX_TRIE_NODE_LEN * this.MAX_PROOF_LEVELS;
}

export class StorageCircuitConfig {
  public static readonly VALUE_LEN = BYTES32_LEN;
  private static readonly KEY_LEN = BYTES32_LEN;
  private static readonly PREFIXED_KEY_LEN = 1 + this.KEY_LEN;
  public static readonly PREFIXED_KEY_NIBBLE_LEN = this.PREFIXED_KEY_LEN * BYTE_HEX_LEN;
  private static readonly KEY_RLP_HEADER_LEN = getRlpHeaderSize(this.PREFIXED_KEY_LEN);
  private static readonly VALUE_RLP_HEADER_LEN = getRlpHeaderSize(this.VALUE_LEN);
  private static readonly MAX_LEAF_CONTENT_LEN =
    this.KEY_RLP_HEADER_LEN + this.PREFIXED_KEY_LEN + this.VALUE_RLP_HEADER_LEN + this.VALUE_LEN;
  private static readonly MAX_LEAF_RLP_HEADER_LEN = getRlpHeaderSize(this.MAX_LEAF_CONTENT_LEN);
  public static readonly MAX_LEAF_LEN = this.MAX_LEAF_RLP_HEADER_LEN + this.MAX_LEAF_CONTENT_LEN;

  public static readonly MAX_PROOF_LEVELS = 7;
  public static readonly PROOF_LEN = MAX_TRIE_NODE_LEN * this.MAX_PROOF_LEVELS;
}

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
  const proof = encodeProof(ethProof.accountProof, AccountCircuitConfig.PROOF_LEN);
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
  const proof = encodeProof(storageProof.proof, StorageCircuitConfig.PROOF_LEN);
  const depth = encodeField(storageProof.proof.length);

  return [key, value, proof, depth];
}

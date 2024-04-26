import { ForeignCallOutput } from '@noir-lang/noir_js';
import { GetProofReturnType, Hex, fromRlp, isHex } from 'viem';
import { encodeBytes32, encodeField, encodeHex, encodeProof } from '../common/encode.js';
import { padArray } from '../../../util/array.js';
import { ADDRESS_LEN, BYTES32_LEN, ZERO_PAD_VALUE } from '../common/const.js';
import { assert } from '../../../util/assert.js';
import { getRlpHeaderSize } from '../common/util.js';
import { getProofConfig } from '../common/proofConfig.js';

// TODO: Remove this
export const MAX_ACCOUNT_STATE_LEN = 134;

export class AccountProofConfig {
  private static readonly U64_BYTES = 8;
  private static readonly MAX_VALUE_CONTENT_LEN =
    getRlpHeaderSize(this.U64_BYTES) +
    this.U64_BYTES /* Nonce */ +
    getRlpHeaderSize(BYTES32_LEN) +
    BYTES32_LEN /* Balance */ +
    getRlpHeaderSize(BYTES32_LEN) +
    BYTES32_LEN /* Storage root */ +
    getRlpHeaderSize(BYTES32_LEN) +
    BYTES32_LEN; /* Code hash */
  public static readonly MAX_VALUE_LEN = getRlpHeaderSize(this.MAX_VALUE_CONTENT_LEN) + this.MAX_VALUE_CONTENT_LEN;
  private static readonly KEY_LEN = ADDRESS_LEN;
  public static readonly MAX_PROOF_LEVELS = 11;

  private static readonly config = getProofConfig(this.KEY_LEN, this.MAX_VALUE_LEN, this.MAX_PROOF_LEVELS);
  public static readonly MAX_PREFIXED_KEY_NIBBLE_LEN = this.config.maxPrefixedKeyNibbleLen;
  public static readonly MAX_LEAF_LEN = this.config.maxLeafLen;
  public static readonly MAX_PROOF_LEN = this.config.maxProofLen;
}

export class StorageProofConfig {
  public static readonly VALUE_LEN = BYTES32_LEN;
  private static readonly KEY_LEN = BYTES32_LEN;
  public static readonly MAX_PROOF_LEVELS = 7;

  private static readonly config = getProofConfig(this.KEY_LEN, this.VALUE_LEN, this.MAX_PROOF_LEVELS);
  public static readonly MAX_PREFIXED_KEY_NIBBLE_LEN = this.config.maxPrefixedKeyNibbleLen;
  public static readonly MAX_LEAF_LEN = this.config.maxLeafLen;
  public static readonly MAX_PROOF_LEN = this.config.maxProofLen;
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
  const proof = encodeProof(ethProof.accountProof, AccountProofConfig.MAX_PROOF_LEN);
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
  return padArray(encodeHex(getValue(proof)), MAX_ACCOUNT_STATE_LEN, ZERO_PAD_VALUE, 'left');
}

type StorageProof = GetProofReturnType['storageProof'][number];

export function encodeStorageProof(storageKey: Hex, storageProof: StorageProof): ForeignCallOutput[] {
  const key = encodeHex(storageKey);
  const value = encodeBytes32(storageProof.value);
  const proof = encodeProof(storageProof.proof, StorageProofConfig.MAX_PROOF_LEN);
  const depth = encodeField(storageProof.proof.length);

  return [key, value, proof, depth];
}

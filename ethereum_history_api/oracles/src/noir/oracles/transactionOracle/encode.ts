import { Transaction } from 'viem';
import { ZERO_PAD_VALUE } from '../common/const.js';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import { encodeAddress, encodeBytes, encodeField, encodeHex, encodeProof } from '../common/encode.js';
import { BYTE_HEX_LEN, U1_ZERO } from '../../../util/const.js';
import { Proof } from '../../../ethereum/proof.js';
import { padArray } from '../../../util/array.js';
import { removeHexPrefix } from '../../../util/hex.js';
import { getProofConfig } from '../common/proofConfig.js';

// TODO: Remove this when we remove legacy fixtures
export const LEGACY_MAX_TX_ENCODED_LEN = 525;
export const LEGACY_MAX_TX_RLP_LEN = LEGACY_MAX_TX_ENCODED_LEN - 1;

class TxProofConfig {
  public static readonly MAX_KEY_LEN = 3;
  public static readonly MAX_PROOF_LEVELS = 7;
}

export class TxProofConfigM extends TxProofConfig {
  public static MAX_VALUE_LEN = 1000;

  private static readonly config = getProofConfig(this.MAX_KEY_LEN, this.MAX_VALUE_LEN, this.MAX_PROOF_LEVELS);
  public static readonly MAX_PREFIXED_KEY_NIBBLE_LEN = this.config.maxPrefixedKeyNibbleLen;
  public static readonly MAX_LEAF_LEN = this.config.maxLeafLen;
  public static readonly MAX_PROOF_LEN = this.config.maxProofLen;
}

export enum TX_OFFSETS {
  NONCE,
  GAS_LIMIT,
  TO,
  TO_IS_SOME,
  VALUE,
  DATA,
  DATA_LEN
}

export function encodeTx(transaction: Transaction): ForeignCallOutput[] {
  const nonce = encodeField(transaction.nonce);
  const gasLimit = encodeField(transaction.gas);
  const to = encodeAddress(transaction.to ?? U1_ZERO);
  const toIsSome = transaction.to === null ? '0x00' : '0x01';
  const value = encodeField(transaction.value);
  const data = encodeHex(transaction.input);

  const data_len_field = removeHexPrefix(transaction.input).length / BYTE_HEX_LEN;
  const data_len = encodeField(data_len_field);

  const v = encodeField(transaction.v);
  const r = encodeHex(transaction.r);
  const s = encodeHex(transaction.s);

  return [nonce, gasLimit, to, toIsSome, value, data, data_len, v, r, s];
}

export function encodeTxProof(txProof: Proof): ForeignCallOutput[] {
  const key = encodeBytes(BigInt(txProof.key), TxProofConfig.MAX_KEY_LEN);
  const value = padArray(encodeHex(txProof.value), LEGACY_MAX_TX_RLP_LEN, ZERO_PAD_VALUE);
  const proof = encodeProof(txProof.proof, TxProofConfigM.MAX_PROOF_LEN);
  const depth = encodeField(txProof.proof.length);

  return [key, value, proof, depth];
}

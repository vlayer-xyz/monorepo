import { Transaction } from 'viem';
import { ZERO_PAD_VALUE } from '../common/const.js';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import { encodeAddress, encodeBytes, encodeField, encodeHex, encodeProof, encodeU128 } from '../common/encode.js';
import { BYTE_HEX_LEN, U1_ZERO } from '../../../util/const.js';
import { Proof } from '../../../ethereum/proof.js';
import { padArray } from '../../../util/array.js';
import { removeHexPrefix } from '../../../util/hex.js';
import { LEGACY_MAX_TX_ENCODED_LEN, txProofConfigM } from '../common/proofConfig/tx.js';
import { MAX_DATA_LEN } from '../common/txConfig.js';

export enum TX_OFFSETS {
  NONCE,
  GAS_LIMIT,
  TO,
  TO_IS_SOME,
  VALUE_HI,
  VALUE_LO,
  DATA,
  DATA_LEN
}

export function encodeTx(transaction: Transaction): ForeignCallOutput[] {
  const nonce = encodeField(transaction.nonce);
  const gasLimit = encodeField(transaction.gas);
  const to = encodeAddress(transaction.to ?? U1_ZERO);
  const toIsSome = transaction.to === null ? '0x00' : '0x01';
  const value = encodeU128(transaction.value);
  const data = padArray(encodeHex(transaction.input), MAX_DATA_LEN, ZERO_PAD_VALUE);
  const data_len_field = removeHexPrefix(transaction.input).length / BYTE_HEX_LEN;
  const data_len = encodeField(data_len_field);

  const v = encodeField(transaction.v);
  const r = encodeHex(transaction.r);
  const s = encodeHex(transaction.s);

  return [nonce, gasLimit, to, toIsSome, ...value, data, data_len, v, r, s];
}

export function encodeTxProof(txProof: Proof): ForeignCallOutput[] {
  const key = encodeBytes(BigInt(txProof.key), txProofConfigM.maxKeyLen);
  const proof = encodeProof(txProof.proof, txProofConfigM.maxProofLen);
  const depth = encodeField(txProof.proof.length);
  const value = padArray(encodeHex(txProof.value), LEGACY_MAX_TX_ENCODED_LEN, ZERO_PAD_VALUE, 'left');

  return [key, proof, depth, value];
}

import { Transaction } from 'viem';
import { MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE } from '../common/const.js';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import { encodeAddress, encodeBytes, encodeField, encodeHex, encodeProof, encodeU128 } from '../common/encode.js';
import { BYTE_HEX_LEN, U1_ZERO } from '../../../util/const.js';
import { Proof } from '../../../ethereum/proof.js';
import { padArray } from '../../../util/array.js';
import { removeHexPrefix } from '../../../util/hex.js';
import { txProofConfigM } from '../common/proofConfig/tx.js';
import { MAX_DATA_LEN_M } from '../common/txConfig.js';

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
  const data = padArray(encodeHex(transaction.input), MAX_DATA_LEN_M, ZERO_PAD_VALUE);
  const data_len_field = removeHexPrefix(transaction.input).length / BYTE_HEX_LEN;
  const data_len = encodeField(data_len_field);

  const v = encodeField(transaction.v);
  const r = encodeHex(transaction.r);
  const s = encodeHex(transaction.s);

  return [nonce, gasLimit, to, toIsSome, ...value, data, data_len, v, r, s];
}

export function encodeTxProof(txProof: Proof): ForeignCallOutput {
  const key = encodeBytes(BigInt(txProof.key), txProofConfigM.maxPrefixedKeyNibbleLen);
  const value = padArray(encodeHex(txProof.value), txProofConfigM.maxValueLen, ZERO_PAD_VALUE, 'left');
  const nodes = encodeProof(
    txProof.proof.slice(0, txProof.proof.length - 1),
    (txProofConfigM.maxProofDepth - 1) * MAX_TRIE_NODE_LEN
  );
  const leaf = padArray(encodeHex(txProof.proof[txProof.proof.length - 1]), txProofConfigM.maxLeafLen, ZERO_PAD_VALUE);
  const depth = encodeField(txProof.proof.length);

  return [...key, ...value, ...nodes, ...leaf, depth];
}

import { Transaction } from 'viem';
import { MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE } from '../common/const.js';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import { encodeAddress, encodeBytes, encodeField, encodeHex, encodeProof } from '../common/encode.js';
import { BYTE_HEX_LEN, U1_ZERO } from '../../../util/const.js';
import { Proof } from '../../../ethereum/proof.js';
import { padArray } from '../../../util/array.js';
import { removeHexPrefix } from '../../../util/hex.js';

const MAX_TX_KEY_LEN = 3;
export const MAX_TX_KEY_NIBBLE_LEN = MAX_TX_KEY_LEN * BYTE_HEX_LEN;
export const MAX_TX_PREFIXED_KEY_NIBBLE_LEN = MAX_TX_KEY_NIBBLE_LEN + BYTE_HEX_LEN;
export const MAX_TX_TREE_DEPTH = MAX_TX_KEY_NIBBLE_LEN + 1;
export const MAX_TX_ENCODED_LEN = 525;
export const MAX_TX_RLP_LEN = MAX_TX_ENCODED_LEN - 1;
export const MAX_TX_PROOF_LEN = MAX_TRIE_NODE_LEN * MAX_TX_TREE_DEPTH;
export const MAX_TX_SIZE_M = 1000;
// MAX_LEAF_SIZE_M = MAX_RLP_LIST_HEADER_SIZE + ((MAX_KEY_RLP_HEADER_SIZE + MAX_PREFIXED_KEY_SIZE) + (MAX_TX_HEADER_SIZE_M + MAX_TX_SIZE_M))
// MAX_PREFIXED_KEY_SIZE = 1 + 3
// MAX_KEY_RLP_HEADER_SIZE = 0
// MAX_TX_HEADER_SIZE_M = 1 + 2 = 3 - Length of RLP header for 1000 element string
// MAX_RLP_LIST_HEADER_SIZE = 1 + 2 = 3 - Length of RLP header for 1000 element list
// MAX_LEAF_SIZE_M = 3 + ((1 + (1 + 3)) + (3 + 1000)) = 1011
export const MAX_TX_LEAF_SIZE_M = 1011;

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
  const key = encodeBytes(BigInt(txProof.key), MAX_TX_KEY_LEN);
  const value = padArray(encodeHex(txProof.value), MAX_TX_RLP_LEN, ZERO_PAD_VALUE);
  const proof = encodeProof(txProof.proof, MAX_TX_PROOF_LEN);
  const depth = encodeField(txProof.proof.length);

  return [key, value, proof, depth];
}

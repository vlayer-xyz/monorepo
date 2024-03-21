import { GetTransactionReturnType } from 'viem';
import { encodeHexString, encodeNullable, formatArray } from '../../noir/noir_js/encode.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { encodeAddress, encodeField } from '../../noir/oracles/common/encode.js';
import { MAX_TRANSACTION_DATA_SIZE } from '../../noir/oracles/transactionOracle/encode.js';
import { padArray } from '../../util/array.js';

export function createTransactionFixture(tx: GetTransactionReturnType): string {
  const nonce = encodeField(tx.nonce);
  const gasPrice = encodeNullable(tx.gasPrice !== undefined ? encodeField(tx.gasPrice) : null);
  const gasLimit = encodeField(tx.gas);
  const to = encodeNullable(tx.to !== null ? formatArray(encodeAddress(tx.to)) : null);
  const value = encodeField(tx.value);
  const data = padArray(encodeHexString(tx.input), MAX_TRANSACTION_DATA_SIZE, ZERO_PAD_VALUE);
  const dataLen = encodeField(tx.input.length);
  const v = encodeField(tx.v);
  const r = encodeHexString(tx.r);
  const s = encodeHexString(tx.s);

  return `use crate::transaction::Transaction;

global transaction = Transaction {
  nonce: ${nonce},
  gas_price: ${gasPrice},
  gas_limit: ${gasLimit},
  to: ${to},
  value: ${value},
  data: ${formatArray(data)},
  data_len: ${dataLen},
  v: ${v},
  r: ${formatArray(r)},
  s: ${formatArray(s)}
};
`;
}

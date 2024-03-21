import { GetTransactionReturnType } from 'viem';
import { encodeField, encodeAddress } from '../../noir/oracles/common/encode.js';
import { encodeHexString, encodeNullable, formatArray } from '../../noir/noir_js/encode.js';

export function createTransactionFixture(tx: GetTransactionReturnType): string {
  const nonce = encodeField(tx.nonce);
  const gasPrice = encodeNullable(tx.gasPrice !== undefined ? encodeField(tx.gasPrice) : null);
  const gasLimit = encodeField(tx.gas);
  const to = encodeNullable(tx.to !== null ? formatArray(encodeAddress(tx.to)) : null);
  const value = encodeField(tx.value);
  const data = encodeHexString(tx.input);
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

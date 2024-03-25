import { GetTransactionReturnType, hexToNumber } from 'viem';
import { encodeHexString, encodeOptional, joinArray } from '../../noir/noir_js/encode.js';
import { encodeAddress, encodeField } from '../../noir/oracles/common/encode.js';

export function createTransactionFixture(tx: GetTransactionReturnType): string {
  const gasPrice = encodeOptional(tx.gasPrice?.toString());
  const to = encodeOptional(tx.to ? joinArray(encodeAddress(tx.to)) : undefined);
  const data = encodeHexString(tx.input).map((it) => hexToNumber(it).toString());
  const dataLen = encodeField(tx.input.length);
  const v = encodeField(tx.v);
  const r = encodeHexString(tx.r);
  const s = encodeHexString(tx.s);

  return `use crate::transaction::Transaction;

global transaction = Transaction {
  nonce: ${tx.nonce},
  gas_price: ${gasPrice},
  gas_limit: ${tx.gas},
  to: ${to},
  value: ${tx.value},
  data: ${joinArray(data)},
  data_len: ${dataLen},
  v: ${v},
  r: ${joinArray(r)},
  s: ${joinArray(s)}
};
`;
}

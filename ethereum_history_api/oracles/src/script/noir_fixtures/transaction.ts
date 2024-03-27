import { GetTransactionReturnType } from 'viem';
import { encodeOptional, joinArray, indentBlock } from '../../noir/noir_js/encode.js';
import { encodeAddress, encodeField, encodeHex } from '../../noir/oracles/common/encode.js';

export function createTransactionFixture(tx: GetTransactionReturnType): string {
  const gasPrice = encodeOptional(tx.gasPrice?.toString());
  const to = encodeOptional(tx.to ? joinArray(encodeAddress(tx.to)) : undefined);
  const data = encodeHex(tx.input);
  const dataLen = encodeField(tx.input.length);
  const v = encodeField(tx.v);
  const r = encodeHex(tx.r);
  const s = encodeHex(tx.s);

  return `use crate::transaction::Transaction;

global transaction = Transaction {
  nonce: ${tx.nonce},
  gas_price: ${gasPrice},
  gas_limit: ${tx.gas},
  to: ${indentBlock(to, 1)},
  value: ${tx.value},
  data: ${indentBlock(joinArray(data), 1)},
  data_len: ${dataLen},
  v: ${v},
  r: ${indentBlock(joinArray(r), 1)},
  s: ${indentBlock(joinArray(s), 1)}
};
`;
}

import { GetTransactionReturnType, hexToNumber } from 'viem';
import { encodeHexString, encodeOptional, joinArray } from '../../noir/noir_js/encode.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { encodeAddress, encodeField } from '../../noir/oracles/common/encode.js';
import { MAX_TRANSACTION_DATA_SIZE } from '../../noir/oracles/transactionOracle/encode.js';
import { padArray } from '../../util/array.js';

export function createTransactionFixture(tx: GetTransactionReturnType): string {
  const gasPrice = encodeOptional(tx.gasPrice?.toString());
  const to = encodeOptional(tx.to ? joinArray(encodeAddress(tx.to)) : undefined);
  const data = padArray(encodeHexString(tx.input), MAX_TRANSACTION_DATA_SIZE, ZERO_PAD_VALUE).map((it) =>
    hexToNumber(it).toString()
  );
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

import { GetTransactionReturnType, hexToNumber } from 'viem';
import { encodeHexString, encodeNullable, formatArray } from '../../noir/noir_js/encode.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { encodeAddress, encodeField } from '../../noir/oracles/common/encode.js';
import { MAX_TRANSACTION_DATA_SIZE } from '../../noir/oracles/transactionOracle/encode.js';
import { padArray } from '../../util/array.js';

export function createTransactionFixture(tx: GetTransactionReturnType): string {
  const gasPrice = encodeNullable(tx.gasPrice !== undefined ? tx.gasPrice.toString() : null);
  const to = encodeNullable(tx.to !== null ? formatArray(encodeAddress(tx.to)) : null);
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
  data: ${formatArray(data)},
  data_len: ${dataLen},
  v: ${v},
  r: ${formatArray(r)},
  s: ${formatArray(s)}
};
`;
}

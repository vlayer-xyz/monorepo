import { GetTransactionReturnType } from 'viem';
import { encodeOptional, joinArray, indentBlock } from '../../noir/noir_js/encode.js';
import { encodeAddress, encodeHex } from '../../noir/oracles/common/encode.js';
import { BYTE_HEX_LEN } from '../../util/const.js';

export function createTransactionFixture(tx: GetTransactionReturnType): string {
  const to = encodeOptional(tx.to ? joinArray(encodeAddress(tx.to)) : undefined);
  const data = encodeHex(tx.input);
  const dataLen = (tx.input.length - '0x'.length) / BYTE_HEX_LEN;
  const v = tx.v;
  const r = encodeHex(tx.r);
  const s = encodeHex(tx.s);

  return `use crate::transaction::TxPartial;

global transaction = TxPartial {
  nonce: ${tx.nonce},
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

import { encodeHex } from '../../noir/oracles/common/encode.js';
import { encodeReceipt, statusToField, txTypeToField } from '../../ethereum/receipt.js';
import { encodeOptional, indentBlock, joinArray } from '../../noir/noir_js/encode.js';
import { padArray } from '../../util/array.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { MAX_ENCODED_RECEIPT_LENGTH } from '../../noir/oracles/receiptOracle/encode.js';
import { TransactionReceipt } from '../../types.js';

export function createReceiptFixture(receipt: TransactionReceipt): string {
  const encodedReceipt = joinArray(
    padArray(encodeHex(encodeReceipt(receipt)), MAX_ENCODED_RECEIPT_LENGTH, ZERO_PAD_VALUE)
  );

  const status = encodeOptional(receipt.status === null ? null : statusToField(receipt.status).toString());
  const stateRoot = encodeOptional(receipt.root ? joinArray(encodeHex(receipt.root)) : receipt.root);
  const logsBloom = joinArray(encodeHex(receipt.logsBloom));

  return `use crate::receipt::TxReceiptPartial;

global tx_type = ${txTypeToField(receipt.type)};
global encoded_receipt = ${encodedReceipt};

global receipt = TxReceiptPartial {
  status: ${status},
  state_root: ${indentBlock(stateRoot, 1)},
  cumulative_gas_used: ${receipt.cumulativeGasUsed},
  logs_bloom: ${indentBlock(logsBloom, 1)}
};
`;
}

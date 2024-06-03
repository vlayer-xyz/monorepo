import { encodeHex } from '../../noir/oracles/common/encode.js';
import { encodeReceipt, receiptToRlpFields, statusToField, txTypeToField } from '../../ethereum/receipt.js';
import { encodeOptional, indentBlock, joinArray } from '../../noir/noir_js/encode.js';
import { padArray } from '../../util/array.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { TransactionReceipt } from '../../types.js';
import { toRlp } from 'viem';
import { MAX_RECEIPT_ENCODED_LEN_M, MAX_RECEIPT_RLP_LEN_M } from '../../noir/oracles/rpc/common/proofConfig/receipt.js';

export function createReceiptFixture(receipt: TransactionReceipt): string {
  const receiptRlp = joinArray(
    padArray(encodeHex(toRlp(receiptToRlpFields(receipt))), MAX_RECEIPT_RLP_LEN_M, ZERO_PAD_VALUE)
  );
  const encodedReceipt = joinArray(
    padArray(encodeHex(encodeReceipt(receipt)), MAX_RECEIPT_ENCODED_LEN_M, ZERO_PAD_VALUE)
  );

  const status = encodeOptional(receipt.status === null ? null : statusToField(receipt.status).toString());
  const stateRoot = encodeOptional(receipt.root ? joinArray(encodeHex(receipt.root)) : receipt.root);
  const logsBloom = joinArray(encodeHex(receipt.logsBloom));

  return `use crate::receipt::{TxReceiptPartial, ForeignCallTxReceiptPartial};
use crate::misc::fragment::Fragment;

global tx_type = ${txTypeToField(receipt.type)};
global receipt_rlp = ${receiptRlp};
global encoded_receipt = Fragment::from_array(${encodedReceipt});

global receipt = TxReceiptPartial {
  status: ${status},
  state_root: ${indentBlock(stateRoot, 1)},
  cumulative_gas_used: ${receipt.cumulativeGasUsed},
  logs_bloom: ${indentBlock(logsBloom, 1)}
};

global foreign_call_receipt: ForeignCallTxReceiptPartial = receipt.into();
`;
}

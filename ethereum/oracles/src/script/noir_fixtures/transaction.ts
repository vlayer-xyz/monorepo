import { GetTransactionReturnType, toRlp } from 'viem';
import { encodeOptional, joinArray, indentBlock } from '../../noir/noir_js/encode.js';
import { encodeAddress, encodeField, encodeHex } from '../../noir/oracles/common/encode.js';
import { txTypeToField } from '../../ethereum/receipt.js';
import { padArray } from '../../util/array.js';
import { TxRlpEncoder, encodeTx } from '../../ethereum/transaction.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { createBoundedVecFixture } from './boundedVec.js';
import { LEGACY_MAX_TX_RLP_LEN, LEGACY_MAX_TX_ENCODED_LEN } from '../../noir/oracles/rpc/common/proofConfig/tx.js';
import { MAX_DATA_LEN_M } from '../../noir/oracles/rpc/common/txConfig.js';

export function createTransactionFixture(tx: GetTransactionReturnType): string {
  const rlpFields = TxRlpEncoder.txToFields(tx);
  const txRlp = joinArray(padArray(encodeHex(toRlp(rlpFields)), LEGACY_MAX_TX_RLP_LEN, ZERO_PAD_VALUE));
  const encodedTx = joinArray(padArray(encodeHex(encodeTx(tx)), LEGACY_MAX_TX_ENCODED_LEN, ZERO_PAD_VALUE));

  const txIdx = encodeField(tx.transactionIndex);
  const to = encodeOptional(tx.to ? joinArray(encodeAddress(tx.to)) : undefined);
  const v = tx.v;
  const r = encodeHex(tx.r);
  const s = encodeHex(tx.s);

  return `use crate::transaction::{TxPartial, ForeignCallTransaction};

global tx_idx = ${txIdx};

global tx_type = ${txTypeToField(tx.type)};
global tx_rlp = ${txRlp};
global encoded_tx = ${encodedTx};

global transaction = TxPartial {
  nonce: ${tx.nonce},
  gas_limit: ${tx.gas},
  to: ${indentBlock(to, 1)},
  value: U128::from_integer(${tx.value}),
  data: ${indentBlock(createBoundedVecFixture(tx.input, MAX_DATA_LEN_M), 1)},
  v: ${v},
  r: ${indentBlock(joinArray(r), 1)},
  s: ${indentBlock(joinArray(s), 1)}
};

global foreign_call_transaction: ForeignCallTransaction<${MAX_DATA_LEN_M}> = transaction.into();
`;
}

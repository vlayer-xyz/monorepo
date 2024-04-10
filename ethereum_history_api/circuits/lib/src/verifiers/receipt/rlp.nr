use crate::{
    verifiers::receipt::{MAX_RECEIPT_RLP_LENGTH, is_pre_byzantium},
    receipt::{BLOOM_FILTER_LEN, TxReceiptPartial}
};
use dep::proof::const::HASH_LENGTH;
use crate::misc::arrays::sub_array_equals_up_to_length;
use crate::misc::bytes::byte_value;
use crate::misc::types::PaddedValue;
use crate::rlp::decode::{RlpList, decode_list, STRING};
use dep::u2b::u32_to_u8;

global RECEIPT_FIELDS_COUNT = 4;
global STATE_ROOT_INDEX = 0;
global STATUS_INDEX = 0;
global CUMULATIVE_GAS_USED_INDEX = 1;
global LOGS_BLOOM_INDEX = 2;

pub(crate) fn assert_receipt_rlp_equals<LOG_NUM, MAX_LOG_DATA_LEN>(
    is_pre_byzantium: bool,
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH],
    receipt: TxReceiptPartial<LOG_NUM, MAX_LOG_DATA_LEN>
) {
    let receipt_rlp_list: RlpList<RECEIPT_FIELDS_COUNT> = decode_list(receipt_rlp);
    assert(receipt_rlp_list.num_fields == RECEIPT_FIELDS_COUNT, "Invalid number of fields in receipt RLP");

    if (is_pre_byzantium) {
        receipt_rlp_list.fragments[STATE_ROOT_INDEX].assert_string_eq(
            "State root",
            receipt_rlp,
            Into::into((receipt.state_root.expect(f"State root is missing"), HASH_LENGTH))
        );
    } else {
        receipt_rlp_list.fragments[STATUS_INDEX].assert_string_eq(
            "Status",
            receipt_rlp,
            Into::into(([receipt.status.expect(f"Status is missing") as u8], 1 as u64))
        );
    }

    let cumulative_gas_used = u32_to_u8(receipt.cumulative_gas_used);
    receipt_rlp_list.fragments[CUMULATIVE_GAS_USED_INDEX].assert_string_eq(
        "Cumulative gas used",
        receipt_rlp,
        Into::into(byte_value(cumulative_gas_used))
    );

    receipt_rlp_list.fragments[LOGS_BLOOM_INDEX].assert_string_eq(
        "Logs bloom",
        receipt_rlp,
        Into::into((receipt.logs_bloom, BLOOM_FILTER_LEN))
    );
}

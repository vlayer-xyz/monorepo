use crate::{
    verifiers::receipt::{MAX_RECEIPT_RLP_LENGTH, is_pre_byzantium},
    receipt::{BLOOM_FILTER_LEN, TxReceiptPartial}
};
use dep::proof::const::HASH_LENGTH;
use crate::misc::arrays::sub_array_equals_up_to_length;
use crate::misc::bytes::byte_value;
use crate::rlp::decode::{RlpList, decode_list, STRING, RlpFragment};
use dep::u2b::u32_to_u8;

global RECEIPT_FIELDS_COUNT = 4;
global STATE_ROOT_INDEX = 0;
global STATUS_INDEX = 0;
global CUMULATIVE_GAS_USED_INDEX = 1;
global LOGS_BLOOM_INDEX = 2;

struct PaddedValue<MAX_LEN> {
    value: [u8; MAX_LEN],
    length: u64,
}

impl<MAX_LEN> From<([u8; MAX_LEN], u64)> for PaddedValue<MAX_LEN> {
    fn from((value, length): ([u8; MAX_LEN], u64)) -> Self {
        Self { value, length }
    }
}

fn assert_rlp_fragment<FIELD_NAME_LEN, MAX_RLP_LEN, MAX_VALUE_LEN>(
    field_name: str<FIELD_NAME_LEN>,
    fragment: RlpFragment,
    rlp: [u8; MAX_RLP_LEN],
    value: PaddedValue<MAX_VALUE_LEN>
) {
    assert(fragment.data_type == STRING, f"{field_name}: Invalid RLP type");
    assert(fragment.length == value.length, f"{field_name}: Invalid RLP length");
    assert(
        sub_array_equals_up_to_length(value.value, rlp, fragment.offset, value.length), f"{field_name}: Invalid RLP value"
    );
}

pub(crate) fn assert_receipt_rlp_equals<LOG_NUM, MAX_LOG_DATA_LEN>(
    is_pre_byzantium: bool,
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH],
    receipt: TxReceiptPartial<LOG_NUM, MAX_LOG_DATA_LEN>
) {
    let receipt_rlp_list: RlpList<RECEIPT_FIELDS_COUNT> = decode_list(receipt_rlp);
    assert(receipt_rlp_list.num_fields == RECEIPT_FIELDS_COUNT, "Invalid number of fields in receipt RLP");

    if (is_pre_byzantium) {
        assert_rlp_fragment(
            "State root",
            receipt_rlp_list.fragments[STATE_ROOT_INDEX],
            receipt_rlp,
            Into::into((receipt.state_root.expect(f"State root is missing"), HASH_LENGTH))
        );
    } else {
        assert_rlp_fragment(
            "Status",
            receipt_rlp_list.fragments[STATUS_INDEX],
            receipt_rlp,
            Into::into(([receipt.status.expect(f"Status is missing") as u8], 1 as u64))
        );
    }

    let cumulative_gas_used = u32_to_u8(receipt.cumulative_gas_used);
    assert_rlp_fragment(
        "Cumulative gas used",
        receipt_rlp_list.fragments[CUMULATIVE_GAS_USED_INDEX],
        receipt_rlp,
        Into::into(byte_value(cumulative_gas_used))
    );

    assert_rlp_fragment(
        "Logs bloom",
        receipt_rlp_list.fragments[LOGS_BLOOM_INDEX],
        receipt_rlp,
        Into::into((receipt.logs_bloom, BLOOM_FILTER_LEN))
    );
}

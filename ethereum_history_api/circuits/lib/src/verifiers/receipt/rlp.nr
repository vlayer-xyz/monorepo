use crate::{
    verifiers::receipt::{MAX_RECEIPT_RLP_LENGTH, is_pre_byzantium},
    receipt::{BLOOM_FILTER_LEN, TxReceiptPartial}
};
use dep::proof::const::HASH_LENGTH;
use crate::misc::arrays::sub_array_equals_up_to_length;
use crate::misc::bytes::byte_value;
use crate::rlp::decode::{decode_list, STRING};
use crate::rlp::types::RlpList;
use dep::u2b::u32_to_u8;

global RECEIPT_FIELDS_COUNT = 4;
global STATE_ROOT_INDEX = 0;
global STATUS_INDEX = 0;
global CUMULATIVE_GAS_USED_INDEX = 1;
global LOGS_BLOOM_INDEX = 2;

pub(crate) fn assert_receipt_rlp_equals(
    is_pre_byzantium: bool,
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH],
    receipt: TxReceiptPartial
) {
    let receipt_rlp_list: RlpList<RECEIPT_FIELDS_COUNT> = decode_list(receipt_rlp);
    assert(receipt_rlp_list.len == RECEIPT_FIELDS_COUNT, "Invalid number of fields in receipt RLP");

    if (is_pre_byzantium) {
        receipt_rlp_list.get(STATE_ROOT_INDEX).assert_eq_bytes32(
            "State root",
            receipt_rlp,
            receipt.state_root.expect(f"State root is missing")
        );
    } else {
        receipt_rlp_list.get(STATUS_INDEX).assert_eq_string(
            "Status",
            receipt_rlp,
            BoundedVec { storage: [receipt.status.expect(f"Status is missing") as u8], len: 1 }
        );
    }

    let cumulative_gas_used = u32_to_u8(receipt.cumulative_gas_used);
    receipt_rlp_list.get(CUMULATIVE_GAS_USED_INDEX).assert_eq_string(
        "Cumulative gas used",
        receipt_rlp,
        byte_value(cumulative_gas_used)
    );

    receipt_rlp_list.get(LOGS_BLOOM_INDEX).assert_eq_bytes_length("Logs bloom", receipt_rlp, receipt.logs_bloom, BLOOM_FILTER_LEN);
}

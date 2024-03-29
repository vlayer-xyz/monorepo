use crate::{
    verifiers::receipt::{split::MAX_RECEIPT_RLP_LENGTH, is_pre_byzantium},
    receipt::{BLOOM_FILTER_LEN, TxReceiptPartial}
};
use dep::proof::{const::HASH_LENGTH, rlp::{RLP_List, decode1, STRING}, utils::byte_value};
use crate::misc::arrays::sub_array_equals_up_to_length;
use dep::u2b::u32_to_u8;

global RECEIPT_FIELDS_COUNT = 4;
global STATE_ROOT_INDEX = 0;
global STATUS_INDEX = 0;
global CUMULATIVE_GAS_USED_INDEX = 1;
global LOGS_BLOOM_INDEX = 2;

pub(crate) fn assert_receipt_rlp_equals<LOG_NUM, MAX_LOG_DATA_LEN>(
    block_number: Field,
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH],
    receipt: TxReceiptPartial<LOG_NUM, MAX_LOG_DATA_LEN>
) {
    let receipt_rlp_list: RLP_List<RECEIPT_FIELDS_COUNT> = decode1(receipt_rlp);
    assert(receipt_rlp_list.num_fields == RECEIPT_FIELDS_COUNT, "Invalid number of fields in receipt RLP");

    if (is_pre_byzantium(block_number as u64)) {
        assert(receipt_rlp_list.data_type[STATE_ROOT_INDEX] == STRING, "Invalid state root type");
        assert(receipt_rlp_list.length[STATE_ROOT_INDEX] == HASH_LENGTH, "Invalid state root length");
        assert(
            sub_array_equals_up_to_length(
                receipt.state_root.expect(f"State root is missing"),
                receipt_rlp,
                receipt_rlp_list.offset[STATE_ROOT_INDEX],
                HASH_LENGTH as u64
            ), "State root mismatch"
        );
    } else {
        let status = receipt.status.expect(f"Status is missing");
        assert(receipt_rlp_list.data_type[STATUS_INDEX] == STRING, "Invalid status type");
        assert(receipt_rlp_list.length[STATUS_INDEX] == 1, "Invalid status length");
        assert(receipt_rlp[receipt_rlp_list.offset[STATUS_INDEX]] as u1 == status, "Status mismatch");
    }

    let cumulative_gas_used = u32_to_u8(receipt.cumulative_gas_used as u32);
    let (cumulative_gas_used, cumulative_gas_used_length) = byte_value(cumulative_gas_used);
    assert(
        receipt_rlp_list.data_type[CUMULATIVE_GAS_USED_INDEX] == STRING, "Invalid cumulative gas used type"
    );
    assert(
        receipt_rlp_list.length[CUMULATIVE_GAS_USED_INDEX] == cumulative_gas_used_length, "Invalid cumulative gas used length"
    );
    assert(
        sub_array_equals_up_to_length(
            cumulative_gas_used,
            receipt_rlp,
            receipt_rlp_list.offset[CUMULATIVE_GAS_USED_INDEX],
            cumulative_gas_used_length as u64
        ), "Cumulative gas used mismatch"
    );

    assert(receipt_rlp_list.data_type[LOGS_BLOOM_INDEX] == STRING, "Invalid logs bloom type");
    assert(receipt_rlp_list.length[LOGS_BLOOM_INDEX] == BLOOM_FILTER_LEN, "Invalid logs bloom length");
    assert(
        sub_array_equals_up_to_length(
            receipt.logs_bloom,
            receipt_rlp,
            receipt_rlp_list.offset[LOGS_BLOOM_INDEX],
            BLOOM_FILTER_LEN as u64
        ), "Logs bloom mismatch"
    );
}

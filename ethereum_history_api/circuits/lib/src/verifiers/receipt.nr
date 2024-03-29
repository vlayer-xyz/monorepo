mod split;
mod split_test;

use dep::proof::{
    const::{HASH_LENGTH, MAX_RECEIPT_RLP_LENGTH as MAX_ENCODED_RECEIPT_LENGTH}, trie_proof::TrieProof,
    rlp::{RLP_List, decode1, decode0, STRING, LIST}, utils::{byte_value, memcpy}
};
use crate::receipt::{TxReceiptProof, TxReceiptPartial, MAX_RECEIPT_TREE_DEPTH, TxType, BLOOM_FILTER_LEN};
use crate::verifiers::receipt::split::{split_receipt_into_tx_type_and_receipt_rlp, MAX_RECEIPT_RLP_LENGTH};
use crate::misc::arrays::sub_array_equals_up_to_length;
use dep::u2b::u32_to_u8;

global RECEIPT_FIELDS_COUNT = 4;
global BYZANTIUM_BLOCK_NUM = 4_370_000;

pub(crate) fn is_pre_byzantium(block_number: u64) -> bool {
    block_number < BYZANTIUM_BLOCK_NUM as u64
}

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

pub(crate) fn assert_receipt_equals<LOG_NUM, MAX_LOG_DATA_LEN>(
    block_number: Field,
    tx_type: TxType,
    encoded_receipt: [u8; MAX_ENCODED_RECEIPT_LENGTH],
    receipt: TxReceiptPartial<LOG_NUM, MAX_LOG_DATA_LEN>
) {
    let (actual_tx_type, receipt_rlp) = split_receipt_into_tx_type_and_receipt_rlp(tx_type, encoded_receipt);

    assert(actual_tx_type == tx_type, "Invalid tx type");
    assert_receipt_rlp_equals(block_number, receipt_rlp, receipt);
}

fn assert_receipt_proof<MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_RLP_LEN>(proof: TxReceiptProof, root: [u8; HASH_LENGTH]) {
    assert(false, "Not implemented");
}

pub fn verify_receipt<LOG_NUM, MAX_LOG_DATA_LEN, MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_RLP_LEN>(
    block_number: Field,
    tx_idx: Field,
    receipt: TxReceiptPartial<LOG_NUM, MAX_LOG_DATA_LEN>,
    receipt_proof: TxReceiptProof,
    receipt_root: [u8; HASH_LENGTH]
) {
    assert(false, "Not implemented");
}


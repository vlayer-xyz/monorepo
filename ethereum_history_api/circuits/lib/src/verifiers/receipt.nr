use dep::u2b::{u64_to_u8, u32_to_u8};
use dep::proof::{
    const::{HASH_LENGTH, MAX_RECEIPT_RLP_LENGTH, HASH_LENGTH}, trie_proof::TrieProof,
    rlp::{RLP_List, decode1, decode0, STRING, LIST}, utils::{byte_value, memcpy}
};
use crate::receipt::{TxReceiptProof, TxReceiptPartial, MAX_RECEIPT_TREE_DEPTH, TxType, BLOOM_FILTER_LEN};
use crate::misc::{arrays::sub_array_equals_up_to_length, bytes::{nibbles_to_bytes, left_to_right_padding, right_pad}};

global KEY_LEN = 6;
global MAX_TX_IDX_BYTES_LEN = 2;

global RECEIPT_FIELDS_COUNT = 4;

global BYZANTIUM_BLOCK_NUM: u64 = 4_370_000;

pub(crate) fn is_pre_byzantium(block_number: u64) -> bool {
    block_number < BYZANTIUM_BLOCK_NUM
}

pub(crate) fn split_receipt_into_tx_type_and_receipt_rlp(
    tx_type: TxType,
    encoded_receipt: [u8; MAX_RECEIPT_RLP_LENGTH]
) -> (u8, [u8; MAX_RECEIPT_RLP_LENGTH]) {
    if (tx_type == 0) {
        (tx_type, encoded_receipt)
    } else {
        let mut receipt_rlp = [0; MAX_RECEIPT_RLP_LENGTH];
        memcpy(&mut receipt_rlp, encoded_receipt, 1);
        (encoded_receipt[0], receipt_rlp)
    }
}

pub(crate) fn assert_receipt_rlp_equal<LOG_NUM, MAX_LOG_DATA_LEN>(
    block_number: u64,
    receipt_rlp_right_padded: [u8; MAX_RECEIPT_RLP_LENGTH],
    receipt: TxReceiptPartial<LOG_NUM, MAX_LOG_DATA_LEN>
) {
    let receipt_rlp: RLP_List<RECEIPT_FIELDS_COUNT> = decode1(receipt_rlp_right_padded);
    assert(receipt_rlp.num_fields == RECEIPT_FIELDS_COUNT, "Invalid number of fields in receipt RLP");

    if (is_pre_byzantium(block_number)) {
      // State root
    } else {
      // Status
    }
    // Gas used
    // Logs bloom
    assert(false, "Not implemented");
}

pub fn assert_tx_idx_equals(key_as_rlp: [u8; KEY_LEN], tx_idx: Field) {
    let (key_right_padded, shifted_by) = left_to_right_padding(key_as_rlp);
    let key_bytes: [u8; KEY_LEN / 2] = nibbles_to_bytes(key_right_padded);
    let (rlp_offset, rlp_len) = decode0(key_bytes);
    assert(shifted_by + 2 * (rlp_len + rlp_offset) == KEY_LEN, "key is not an rlp-encoded string");

    if (rlp_len == 0) {
        assert(tx_idx == 0, "key does not match rlp-encoded transaction index");
    } else {
        let mut tx_idx_bytes = [0; MAX_TX_IDX_BYTES_LEN];
        let (tx_idx_right_padded, _) = right_pad(u64_to_u8(tx_idx as u64));
        memcpy(&mut tx_idx_bytes, tx_idx_right_padded, 0);

        assert(
            sub_array_equals_up_to_length(tx_idx_bytes, key_bytes, rlp_offset, rlp_len), "key does not match rlp-encoded transaction index"
        );
    }
}

pub(crate) fn assert_receipt_equals<LOG_NUM, MAX_LOG_DATA_LEN>(
    block_number: u64,
    tx_type: TxType,
    encoded_receipt: [u8; MAX_RECEIPT_RLP_LENGTH],
    receipt: TxReceiptPartial<LOG_NUM, MAX_LOG_DATA_LEN>
) {
    let (actual_tx_type, receipt_rlp_right_padded) = split_receipt_into_tx_type_and_receipt_rlp(tx_type, encoded_receipt);

    assert(actual_tx_type == tx_type, "Invalid tx type");
    assert_receipt_rlp_equal(block_number, receipt_rlp_right_padded, receipt);
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


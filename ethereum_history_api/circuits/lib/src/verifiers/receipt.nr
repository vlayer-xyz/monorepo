use dep::proof::{const::HASH_LENGTH, trie_proof::TrieProof, rlp::decode0};
use dep::u2b::u64_to_u8;

use crate::receipt::{TxReceiptProof, TxReceipt, MAX_RECEIPT_TREE_DEPTH};
use crate::misc::{arrays::sub_array_equals_up_to_length, bytes::{nibbles_to_bytes, bytes_to_field, left_nibble_shift}};

global KEY_LEN = 6;

pub(crate) fn assert_receipt_equals<LOG_NUM, MAX_LOG_DATA_LEN, MAX_RECEIPT_RLP_LEN>(
    block_number: Field,
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LEN],
    receipt: TxReceipt<LOG_NUM, MAX_LOG_DATA_LEN>
) {
    assert(false, "Not implemented");
}

fn assert_tx_idx_equals(key: [u8; KEY_LEN], tx_idx: Field) {
    let (key_right_padded, shifted_by_len) = left_nibble_shift(key);
    let key_bytes: [u8; KEY_LEN / 2] = nibbles_to_bytes(key_right_padded);
    let (rlp_offset, rlp_len) = decode0(key_bytes);
    assert(shifted_by_len + 2 * (rlp_len + rlp_offset) == KEY_LEN, "key is not an rlp-encoded string");

    if (rlp_len == 0) {
        assert(tx_idx == 0);
    }

    assert(
        bytes_to_field(key_bytes, rlp_offset, rlp_len) == tx_idx, "key does not match rlp-encoded transaction index"
    );
}

fn assert_receipt_proof<MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_RLP_LEN>(
    proof: TxReceiptProof,
    root: [u8; HASH_LENGTH]
) {
    assert(false, "Not implemented");
}

pub fn verify_receipt<LOG_NUM, MAX_LOG_DATA_LEN, MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_RLP_LEN>(
    block_number: Field,
    tx_idx: Field,
    receipt: TxReceipt<LOG_NUM, MAX_LOG_DATA_LEN>,
    receipt_proof: TxReceiptProof,
    receipt_root: [u8; HASH_LENGTH]
) {
    assert(false, "Not implemented");
}


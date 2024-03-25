use dep::proof::{const::HASH_LENGTH, trie_proof::TrieProof, rlp::decode0, utils::byte_value};
use dep::u2b::u32_to_u8;

use crate::receipt::{TxReceiptProof, TxReceipt, MAX_RECEIPT_TREE_DEPTH};
use crate::misc::arrays::sub_array_equals_up_to_length;

pub(crate) fn assert_receipt_equals<LOG_NUM, MAX_LOG_DATA_LEN, MAX_RECEIPT_RLP_LEN>(
    block_number: Field,
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LEN],
    receipt: TxReceipt<LOG_NUM, MAX_LOG_DATA_LEN>
) {
    assert(false, "Not implemented");
}

fn assert_tx_idx_equals(key: [u8; MAX_RECEIPT_TREE_DEPTH], tx_idx: Field) {
    assert(false, "Not implemented");
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


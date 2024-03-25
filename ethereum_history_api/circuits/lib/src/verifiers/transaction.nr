use dep::proof::{const::HASH_LENGTH, trie_proof::TrieProof, rlp::decode0};
use dep::u2b::u64_to_u8;

use crate::receipt::{TxReceiptProof, TxReceipt, MAX_RECEIPT_TREE_DEPTH};
use crate::misc::{arrays::sub_array_equals_up_to_length, bytes::{nibbles_to_bytes, bytes_to_field, left_nibble_shift}};

global KEY_LEN = 6;

pub(crate) fn assert_transaction_equals<MAX_TRANSACTION_DATA_LEN>(
    block_number: Field,
    transaction_rlp: [u8; MAX_TRANSACTION_RLP_LEN],
    transaction: Transaction<MAX_TRANSACTION_DATA_LEN>
) {
    assert(false, "Not implemented");
}

pub fn assert_tx_idx_equals(key: [u8; KEY_LEN], tx_idx: Field) {
    assert(false, "Not implemented");
}

fn assert_transaction_proof<MAX_TRANSACTION_PROOF_LEN, MAX_TRANSACTION_RLP_LEN>(
    proof: TransactionProof,
    root: [u8; HASH_LENGTH]
) {
    assert(false, "Not implemented");
}

pub fn verify_transaction<MAX_TRANSACTION_DATA_LEN, MAX_TRANSACTION_PROOF_LEN, MAX_TRANSACTION_RLP_LEN>(
    block_number: Field,
    tx_idx: Field,
    transaction: Transaction<MAX_TRANSACTION_DATA_LEN>,
    transaction_proof: TransactionProof,
    transaction_root: [u8; HASH_LENGTH]
) {
    assert(false, "Not implemented");
}


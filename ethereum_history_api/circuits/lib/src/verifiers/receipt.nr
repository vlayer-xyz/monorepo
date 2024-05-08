mod rlp;
mod rlp_test;

use dep::proof::{const::HASH_LENGTH, receipt_proof::ReceiptProof, node::key_as_nibbles};
use crate::receipt::{TxReceiptPartial, TxType};
use crate::verifiers::{
    receipt::rlp::assert_receipt_rlp_equals,
    tx_helpers::{split::split_into_tx_type_and_rlp, idx::assert_tx_idx_equals}
};
use crate::misc::bytes::byte_value;
use crate::merkle_patricia_proofs::proof::{ProofInput, verify_merkle_proof};

global BYZANTIUM_BLOCK_NUM = 4_370_000;

global MAX_KEY_LEN = 3;
global MAX_PREFIXED_KEY_NIBBLE_LEN = (MAX_KEY_LEN + 1) * 2;
global MAX_TREE_DEPTH_NO_LEAF = 7 - 1;

pub(crate) fn is_pre_byzantium(block_number: u64) -> bool {
    block_number < BYZANTIUM_BLOCK_NUM as u64
}

pub(crate) fn assert_receipt_equals<MAX_ENCODED_LEN>(
    block_number: u64,
    tx_type: TxType,
    encoded_receipt: [u8; MAX_ENCODED_LEN],
    receipt: TxReceiptPartial
) {
    let is_legacy = tx_type == 0;
    let (actual_tx_type, receipt_rlp) = split_into_tx_type_and_rlp(is_legacy, encoded_receipt);
    let is_pre_byzantium = is_pre_byzantium(block_number);

    assert(actual_tx_type == tx_type, "Invalid tx type");
    assert_receipt_rlp_equals(is_pre_byzantium, receipt_rlp, receipt);
}

pub fn verify_receipt<MAX_ENCODED_LEN, MAX_LEAF_LEN>(
    block_number: u64,
    tx_idx: Field,
    tx_type: TxType,
    receipt: TxReceiptPartial,
    receipt_proof_input: ProofInput<MAX_PREFIXED_KEY_NIBBLE_LEN, MAX_ENCODED_LEN, MAX_TREE_DEPTH_NO_LEAF, MAX_LEAF_LEN>,
    receipt_root: [u8; HASH_LENGTH]
) {
    assert_tx_idx_equals(key_as_nibbles(receipt_proof_input.key), tx_idx);
    let value = byte_value(receipt_proof_input.value).storage;
    assert_receipt_equals(block_number, tx_type, value, receipt);
    verify_merkle_proof(
        receipt_proof_input.key,
        receipt_proof_input.value,
        receipt_root,
        receipt_proof_input.proof
    );
}

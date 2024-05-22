mod rlp;
mod rlp_test;

use dep::proof::{const::HASH_LENGTH, receipt_proof::ReceiptProof, node::key_as_nibbles};
use crate::receipt::{TxReceiptPartial, TxType};
use crate::verifiers::{
    receipt::rlp::assert_receipt_rlp_equals,
    tx_helpers::{split::split_into_tx_type_and_rlp, idx::assert_tx_idx_equals}
};
use crate::misc::{bytes::byte_value, fragment::Fragment};

global BYZANTIUM_BLOCK_NUM = 4_370_000;
global MAX_ENCODED_RECEIPT_LENGTH: u64 = 525;
global MAX_RECEIPT_RLP_LENGTH: u64 = 524; // MAX_ENCODED_RECEIPT_LENGTH - 1;

pub(crate) fn is_pre_byzantium(block_number: u64) -> bool {
    block_number < BYZANTIUM_BLOCK_NUM as u64
}

pub(crate) fn assert_receipt_equals<MAX_ENCODED_LEN>(
    block_number: u64,
    tx_type: TxType,
    encoded_receipt: Fragment<MAX_ENCODED_LEN, u8>,
    receipt: TxReceiptPartial
) {
    let is_legacy = tx_type == 0;
    let (actual_tx_type, receipt_rlp) = split_into_tx_type_and_rlp(is_legacy, encoded_receipt);
    let is_pre_byzantium = is_pre_byzantium(block_number);

    assert(actual_tx_type == tx_type, "Invalid tx type");
    assert_receipt_rlp_equals(is_pre_byzantium, receipt_rlp, receipt);
}

pub(crate) fn assert_receipt_proof<MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_RLP_LEN>(
    proof: ReceiptProof<MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_RLP_LEN>,
    root: [u8; HASH_LENGTH]
) {
    assert(proof.verify_receipt_root(root), "TrieProof: Invalid receipt root");
}

pub fn verify_receipt<MAX_RECEIPT_PROOF_LEN>(
    block_number: u64,
    tx_idx: Field,
    tx_type: TxType,
    receipt: TxReceiptPartial,
    receipt_proof: ReceiptProof<MAX_RECEIPT_PROOF_LEN, MAX_ENCODED_RECEIPT_LENGTH>,
    receipt_root: [u8; HASH_LENGTH]
) {
    assert_tx_idx_equals(key_as_nibbles(receipt_proof.key), tx_idx);
    let value = byte_value(receipt_proof.value).storage;
    assert_receipt_equals(block_number, tx_type, Fragment::from_array(value), receipt);
    assert_receipt_proof(receipt_proof, receipt_root);
}

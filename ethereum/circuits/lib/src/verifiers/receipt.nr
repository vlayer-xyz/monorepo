mod rlp;
mod rlp_test;

use crate::receipt::{TxReceiptPartial, TxType, MAX_PREFIXED_KEY_NIBBLE_LEN, MAX_DEPTH_NO_LEAF};
use crate::verifiers::{
    receipt::rlp::assert_receipt_rlp_equals,
    tx_helpers::{split::split_into_tx_type_and_rlp, idx::assert_tx_idx_equals}
};
use crate::misc::{types::HASH_LEN, bytes::right_pad, fragment::Fragment};
use crate::merkle_patricia_proofs::proof::{ProofInput, verify_merkle_proof};

global BYZANTIUM_BLOCK_NUM = 4_370_000;

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

pub fn verify_receipt<MAX_ENCODED_LEN, MAX_LEAF_LEN>(
    block_number: u64,
    tx_idx: Field,
    tx_type: TxType,
    receipt: TxReceiptPartial,
    receipt_proof_input: ProofInput<MAX_PREFIXED_KEY_NIBBLE_LEN, MAX_ENCODED_LEN, MAX_DEPTH_NO_LEAF, MAX_LEAF_LEN>,
    receipt_root: [u8; HASH_LEN]
) {
    let key = Fragment::from_vec(right_pad(receipt_proof_input.key));
    assert_tx_idx_equals(key, tx_idx);

    let value = right_pad(receipt_proof_input.value).storage;
    assert_receipt_equals(block_number, tx_type, Fragment::from_array(value), receipt);
    verify_merkle_proof(
        receipt_proof_input.key,
        receipt_proof_input.value,
        receipt_root,
        receipt_proof_input.proof
    );
}

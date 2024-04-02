mod split;
mod split_test;
mod rlp;
mod rlp_test;

use dep::proof::{const::HASH_LENGTH, receipt_proof::ReceiptProof};
use crate::receipt::{TxReceiptPartial, TxType};
use crate::verifiers::receipt::{rlp::assert_receipt_rlp_equals, split::split_receipt_into_tx_type_and_receipt_rlp};

global BYZANTIUM_BLOCK_NUM = 4_370_000;
global MAX_ENCODED_RECEIPT_LENGTH: u64 = 525;
global MAX_RECEIPT_RLP_LENGTH: u64 = MAX_ENCODED_RECEIPT_LENGTH - 1;

pub(crate) fn is_pre_byzantium(block_number: u64) -> bool {
    block_number < BYZANTIUM_BLOCK_NUM as u64
}

pub(crate) fn assert_receipt_equals<LOG_NUM, MAX_LOG_DATA_LEN>(
    block_number: Field,
    tx_type: TxType,
    encoded_receipt: [u8; MAX_ENCODED_RECEIPT_LENGTH],
    receipt: TxReceiptPartial<LOG_NUM, MAX_LOG_DATA_LEN>
) {
    let (actual_tx_type, receipt_rlp) = split_receipt_into_tx_type_and_receipt_rlp(tx_type, encoded_receipt);
    let is_pre_byzantium = is_pre_byzantium(block_number as u64);

    assert(actual_tx_type == tx_type, "Invalid tx type");
    assert_receipt_rlp_equals(is_pre_byzantium, receipt_rlp, receipt);
}

pub(crate) fn assert_receipt_proof<MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_RLP_LEN>(
    proof: ReceiptProof<MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_RLP_LEN>,
    root: [u8; HASH_LENGTH]
) {
    assert(proof.verify_receipt_root(root), "TrieProof: Invalid receipt root");
}

pub fn verify_receipt<LOG_NUM, MAX_LOG_DATA_LEN, MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_RLP_LEN>(
    block_number: Field,
    tx_idx: Field,
    receipt: TxReceiptPartial<LOG_NUM, MAX_LOG_DATA_LEN>,
    receipt_proof: ReceiptProof<MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_RLP_LEN>,
    receipt_root: [u8; HASH_LENGTH]
) {
    assert(false, "Not implemented");
}


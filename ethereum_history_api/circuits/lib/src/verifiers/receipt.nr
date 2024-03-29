mod split;
mod split_test;
mod rlp;
mod rlp_test;

use dep::proof::{
    const::{HASH_LENGTH, MAX_RECEIPT_RLP_LENGTH as MAX_ENCODED_RECEIPT_LENGTH}, trie_proof::TrieProof,
    rlp::{RLP_List, decode1, decode0, STRING, LIST}, utils::{byte_value, memcpy}
};
use crate::receipt::{TxReceiptProof, TxReceiptPartial, MAX_RECEIPT_TREE_DEPTH, TxType, BLOOM_FILTER_LEN};
use crate::verifiers::receipt::{
    rlp::assert_receipt_rlp_equals,
    split::{split_receipt_into_tx_type_and_receipt_rlp, MAX_RECEIPT_RLP_LENGTH}
};
use dep::u2b::u32_to_u8;

global BYZANTIUM_BLOCK_NUM = 4_370_000;

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


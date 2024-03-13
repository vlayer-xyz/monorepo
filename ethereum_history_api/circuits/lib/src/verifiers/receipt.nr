use dep::proof::{KEY_LENGTH, TrieProof, rlp::decode0, byte_value};
use dep::u2b::u32_to_u8;

use crate::receipt::{TxReceiptProof, TxReceipt, MAX_RECEIPT_RLP_LENGTH, MAX_RECEIPT_TREE_DEPTH};
use crate::misc::arrays::sub_array_equals_up_to_length;

pub(crate) fn assert_receipt_equals<LOG_NUM>(block_number: Field, receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH], receipt: TxReceipt<LOG_NUM>) {
    // TODO: Implement RLP decoding and equality checks
}

fn assert_tx_idx_equals(key: [u8; MAX_RECEIPT_TREE_DEPTH], tx_idx: Field) {
    let (offset, length) = decode0(key);
    let tx_idx = u32_to_u8(tx_idx as u32);
    let (tx_idx, tx_idx_length) = byte_value(tx_idx);

    assert(length == tx_idx_length, "Tx index length mismatch");
    assert(sub_array_equals_up_to_length(tx_idx, key, offset, length), "Tx index mismatch");
}

fn assert_receipt_proof(receipt_proof: TxReceiptProof, receipts_root: [u8; KEY_LENGTH]) {
    let trie_proof = TrieProof {
        key: receipt_proof.key,
        proof: receipt_proof.proof,
        depth: receipt_proof.depth,
        value: receipt_proof.value
    };
    // TODO: Uncomment when it's implemented
    // assert(trie_proof.verify_receipts_root(receipts_root), "TrieProof: Invalid receipts root");
}

pub fn verify_receipt<LOG_NUM>(
    block_number: Field,
    tx_idx: Field,
    receipt: TxReceipt<LOG_NUM>,
    state_proof: TxReceiptProof,
    state_root: [u8; KEY_LENGTH]
) {
    assert_tx_idx_equals(state_proof.key, tx_idx);
    assert_receipt_equals(block_number, state_proof.value, receipt);
    assert_receipt_proof(state_proof, state_root);
}


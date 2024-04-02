use crate::fixtures::mainnet::{
    cancun::{
    small_block::{
    receipt::{encoded_receipt, receipt, tx_type}, header::{number as block_number, receipts_root},
    receipt_proof::proof
},
    access_list::header::receipts_root as access_list_receipts_root
},
    homestead::fork::{
    receipt::{encoded_receipt as pre_byzantium_encoded_receipt, tx_type as legacy_tx_type},
    header::{number as pre_byzantium_block_number, receipts_root as pre_byzantium_receipt_root},
    receipt_proof::proof as pre_byzantium_receipt_proof
}
};
use crate::verifiers::receipt::{BYZANTIUM_BLOCK_NUM, assert_receipt_equals, assert_receipt_rlp_equals, assert_receipt_proof, MAX_RECEIPT_RLP_LENGTH};

#[test(should_fail_with="Invalid tx type")]
fn test_assert_receipt_equals_wrong_tx_type() {
    let wrong_tx_type = tx_type + 1;
    assert_receipt_equals(BYZANTIUM_BLOCK_NUM, wrong_tx_type, encoded_receipt, receipt);
}

global RLP_SHORT_STRING_TYPE = 0x80;
global RLP_SINGLE_ELEMENT_LIST_HEADER = 0xc1;

// TODO: Add correct assertion message when noir-trie-proofs is updated
#[test(should_fail)]
fn test_assert_receipt_rlp_equals_invalid_rlp_type() {
    let mut rlp_string = [0; MAX_RECEIPT_RLP_LENGTH];
    rlp_string[0] = RLP_SHORT_STRING_TYPE;
    assert_receipt_rlp_equals(BYZANTIUM_BLOCK_NUM, rlp_string, receipt);
}

#[test(should_fail_with="Invalid number of fields in receipt RLP")]
fn test_assert_receipt_rlp_equals_invalid_rlp_field_count() {
    let mut rlp_single_element_list = [0; MAX_RECEIPT_RLP_LENGTH];
    rlp_single_element_list[0] = RLP_SINGLE_ELEMENT_LIST_HEADER;
    rlp_single_element_list[1] = RLP_SHORT_STRING_TYPE;
    assert_receipt_rlp_equals(BYZANTIUM_BLOCK_NUM, rlp_single_element_list, receipt);
}

#[test]
fn test_assert_receipt_proof() {
    assert_receipt_proof(proof, receipts_root);
}

#[test]
fn test_assert_receipt_proof_pre_byzantium() {
    assert_receipt_proof(pre_byzantium_receipt_proof, pre_byzantium_receipt_root);
}

#[test(should_fail_with="Internal node hash does not match the hash extracted from the preceding node")]
fn test_assert_receipt_proof_fail_invalid_receipt_root() {
    assert_receipt_proof(proof, access_list_receipts_root);
}

#[test(should_fail_with="Arrays do not match at specified offset")]
fn test_assert_receipt_proof_fail_invalid_proof_value() {
    let mut proof_invalid_value = proof;
    proof_invalid_value.value[proof_invalid_value.value.len() - 1] += 1;

    assert_receipt_proof(proof_invalid_value, receipts_root);
}

#[test(should_fail_with="Internal node hash does not match the hash extracted from the preceding node")]
fn test_assert_receipt_proof_fail_invalid_proof() {
    let mut proof_invalid_proof = proof;
    proof_invalid_proof.proof[0] += 1;

    assert_receipt_proof(proof_invalid_proof, receipts_root);
}

#[test(should_fail_with="Receipt root: leaf node hash does not match the hash extracted from the preceding node")]
fn test_assert_receipt_proof_fail_invalid_proof_key() {
    let mut proof_invalid_key = proof;
    proof_invalid_key.key[0] += 1;

    assert_receipt_proof(proof_invalid_key, receipts_root);
}

// TODO: This test should fail with an error message
#[test(should_fail)]
fn test_assert_receipt_proof_fail_invalid_proof_depth() {
    let mut proof_invalid_depth = proof;
    proof_invalid_depth.depth += 1;

    assert_receipt_proof(proof_invalid_depth, receipts_root);
}

use crate::verifiers::receipt::{assert_tx_idx_equals, assert_receipt_proof};
use crate::fixtures::mainnet::cancun::small_block::receipt_proof::proof;
use crate::fixtures::mainnet::cancun::small_block::header::receipts_root;
use crate::fixtures::mainnet::cancun::access_list::header::receipts_root as access_list_receipts_root;

#[test]
fn test_assert_tx_idx_equals_zero() {
    let tx_idx = 0x0;
    let key = [0x0, 0x0, 0x0, 0x0, 0x8, 0x0];
    assert_tx_idx_equals(key, tx_idx);
}

#[test]
fn test_assert_tx_idx_equals_odd() {
    let tx_idx = 0xf;
    let key = [0x0, 0x0, 0x0, 0x0, 0x0, 0xf];
    assert_tx_idx_equals(key, tx_idx);
}

#[test]
fn test_assert_tx_idx_equals() {
    let tx_idx = 0xabcd;
    let key = [0x8, 0x2, 0xa, 0xb, 0xc, 0xd];
    assert_tx_idx_equals(key, tx_idx);
}

#[test(should_fail_with="key is not an rlp-encoded string")]
fn test_assert_tx_idx_equals_fail_incorrect_rlp_encoding() {
    let tx_idx = 0x1;
    let key_encoded_incorrectly = [0x0, 0x1, 0xa, 0xb, 0xc, 0xe];
    assert_tx_idx_equals(key_encoded_incorrectly, tx_idx);
}

#[test(should_fail_with="key does not match rlp-encoded transaction index")]
fn test_assert_tx_idx_equals_fail_zero() {
    let wrong_tx_idx = 0x0 + 1;
    let key = [0x0, 0x0, 0x0, 0x0, 0x8, 0x0];
    assert_tx_idx_equals(key, wrong_tx_idx);
}

#[test(should_fail_with="key does not match rlp-encoded transaction index")]
fn test_assert_tx_idx_equals_fail() {
    let tx_idx = 0xabcd;
    let wrong_key = [0x8, 0x2, 0xa, 0xb, 0xc, 0xd + 1];
    assert_tx_idx_equals(wrong_key, tx_idx);
}

#[test]
fn test_assert_receipt_proof() {
    assert_receipt_proof(proof, receipts_root);
}

#[test(should_fail_with="Internal node hash does not match the hash extracted from the preceding node")]
fn test_assert_receipt_proof_fail_invalid_receipt_root() {
    assert_receipt_proof(proof, access_list_receipts_root);
}

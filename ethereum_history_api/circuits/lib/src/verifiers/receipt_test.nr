use dep::proof::const::MAX_RECEIPT_RLP_LENGTH;
use crate::fixtures::mainnet::{cancun::small_block::receipt::{encoded_receipt, receipt, tx_type}};
use crate::misc::arrays::{alter_array, sub_array_equals_up_to_length};
use crate::verifiers::receipt::{
    BYZANTIUM_BLOCK_NUM, assert_receipt_equals, split_receipt_into_tx_type_and_receipt_rlp,
    assert_receipt_rlp_equal, assert_tx_idx_equals
};

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
fn test_split_receipt_into_tx_type_and_receipt_rlp() {
    let (tx_type, receipt_rlp) = split_receipt_into_tx_type_and_receipt_rlp(tx_type, encoded_receipt);
    assert(tx_type == encoded_receipt[0], "Incorrect tx type returned");
    assert(receipt_rlp[0] == encoded_receipt[1], "Incorrect receipt RLP returned");
}

#[test(should_fail_with="Invalid tx type")]
fn test_assert_receipt_equals_wrong_tx_type() {
    let wrong_tx_type = tx_type + 1;
    assert_receipt_equals(BYZANTIUM_BLOCK_NUM, wrong_tx_type, encoded_receipt, receipt);
}

global RLP_SHORT_STRING_TYPE = 0x80;
global RLP_SINGLE_ELEMENT_LIST_HEADER = 0xc1;

// TODO: Add correct assertion message when noir-trie-proofs is updated
#[test(should_fail)]
fn test_assert_receipt_rlp_equal_invalid_rlp_type() {
    let mut rlp_string = [0; MAX_RECEIPT_RLP_LENGTH];
    rlp_string[0] = RLP_SHORT_STRING_TYPE;
    assert_receipt_rlp_equal(BYZANTIUM_BLOCK_NUM, rlp_string, receipt);
}

#[test(should_fail_with="Invalid number of fields in receipt RLP")]
fn test_assert_receipt_rlp_equal_invalid_rlp_field_count() {
    let mut rlp_single_element_list = [0; MAX_RECEIPT_RLP_LENGTH];
    rlp_single_element_list[0] = RLP_SINGLE_ELEMENT_LIST_HEADER;
    rlp_single_element_list[1] = RLP_SHORT_STRING_TYPE;
    assert_receipt_rlp_equal(BYZANTIUM_BLOCK_NUM, rlp_single_element_list, receipt);
}

#[test]
fn test_assert_receipt_rlp_equal() {
    let (_, receipt_rlp) = split_receipt_into_tx_type_and_receipt_rlp(tx_type, encoded_receipt);
    assert_receipt_rlp_equal(BYZANTIUM_BLOCK_NUM, receipt_rlp, receipt);
}

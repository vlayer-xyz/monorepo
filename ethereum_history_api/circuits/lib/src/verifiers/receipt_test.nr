use crate::fixtures::mainnet::{cancun::small_block::{receipt::{encoded_receipt, receipt, tx_type}}};
use crate::verifiers::receipt::{BYZANTIUM_BLOCK_NUM, assert_receipt_equals, assert_receipt_rlp_equals, MAX_RECEIPT_RLP_LENGTH};

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

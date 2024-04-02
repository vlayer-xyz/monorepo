use crate::fixtures::mainnet::{
    cancun::small_block::{receipt::{encoded_receipt, receipt, tx_type}},
};
use crate::verifiers::receipt::{BYZANTIUM_BLOCK_NUM, assert_receipt_equals};

#[test(should_fail_with="Invalid tx type")]
fn test_assert_receipt_equals_wrong_tx_type() {
    let wrong_tx_type = tx_type + 1;
    assert_receipt_equals(BYZANTIUM_BLOCK_NUM, wrong_tx_type, encoded_receipt, receipt);
}

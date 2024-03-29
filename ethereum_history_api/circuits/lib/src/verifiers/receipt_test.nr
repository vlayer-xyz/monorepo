use crate::fixtures::mainnet::{
    cancun::small_block::{receipt::{encoded_receipt, receipt_rlp, receipt, tx_type}, header::number as block_num},
    homestead::fork::{
    header::number as pre_byzantium_block_num,
    receipt::{receipt as pre_byzantium_receipt, receipt_rlp as pre_byzantium_receipt_rlp}
}
};
use crate::verifiers::receipt::{BYZANTIUM_BLOCK_NUM, assert_receipt_equals, MAX_RECEIPT_RLP_LENGTH};
use crate::misc::arrays::{alter_array, resize};
use dep::std::wrapping_add;

#[test(should_fail_with="Invalid tx type")]
fn test_assert_receipt_equals_wrong_tx_type() {
    let wrong_tx_type = tx_type + 1;
    assert_receipt_equals(BYZANTIUM_BLOCK_NUM, wrong_tx_type, encoded_receipt, receipt);
}

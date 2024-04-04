use crate::fixtures::mainnet::{
    cancun::small_block::{receipt::{encoded_receipt, receipt, tx_type}},
    homestead::fork::{receipt::{encoded_receipt as pre_byzantium_encoded_receipt, tx_type as legacy_tx_type}}
};
use crate::misc::arrays::{sub_array_equals, memcpy};
use crate::verifiers::receipt::{split::split_receipt_into_tx_type_and_receipt_rlp, MAX_ENCODED_RECEIPT_LENGTH};

#[test]
fn test_eip1559_tx() {
    let (tx_type, receipt_rlp) = split_receipt_into_tx_type_and_receipt_rlp(tx_type, encoded_receipt);
    assert(tx_type == encoded_receipt[0], "Incorrect tx type returned");
    assert(receipt_rlp.len() == encoded_receipt.len() - 1, "Incorrect receipt RLP length returned");
    assert(sub_array_equals(receipt_rlp, encoded_receipt, 1), "Incorrect receipt RLP returned");
}

#[test]
fn test_legacy_tx() {
    let (tx_type, receipt_rlp) = split_receipt_into_tx_type_and_receipt_rlp(legacy_tx_type, pre_byzantium_encoded_receipt);
    assert(tx_type == legacy_tx_type, "Incorrect tx type returned");
    assert(receipt_rlp.len() == encoded_receipt.len() - 1, "Incorrect receipt RLP length returned");
    assert(
        sub_array_equals(receipt_rlp, pre_byzantium_encoded_receipt, 0), "Incorrect receipt RLP returned"
    );
}

#[test(should_fail_with="RLP receipt exceeds MAX_RECEIPT_RLP_LENGTH")]
fn test_wrong_legacy_rlp() {
    let mut wrong_legacy_rlp = [0; MAX_ENCODED_RECEIPT_LENGTH];
    memcpy(&mut wrong_legacy_rlp, pre_byzantium_encoded_receipt, 0);

    let not_zero_byte = 0x01;
    wrong_legacy_rlp[MAX_ENCODED_RECEIPT_LENGTH - 1] = not_zero_byte;

    let (_, _) = split_receipt_into_tx_type_and_receipt_rlp(legacy_tx_type, wrong_legacy_rlp);
}

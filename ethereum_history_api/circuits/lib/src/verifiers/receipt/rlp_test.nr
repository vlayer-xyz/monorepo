use crate::fixtures::mainnet::{
    cancun::small_block::{receipt::{receipt_rlp, receipt}},
    homestead::fork::{receipt::{receipt as pre_byzantium_receipt, receipt_rlp as pre_byzantium_receipt_rlp}}
};
use crate::verifiers::receipt::rlp::assert_receipt_rlp_equals;
use crate::misc::arrays::{alter_array, resize};
use dep::std::wrapping_add;

#[test]
fn test_pre_byzantium() {
    assert_receipt_rlp_equals(true, pre_byzantium_receipt_rlp, pre_byzantium_receipt);
}

#[test]
fn test_post_byzantium() {
    assert_receipt_rlp_equals(false, receipt_rlp, receipt);
}

// TODO: Add correct assertion message when noir-trie-proofs is updated
#[test(should_fail)]
fn test_assert_receipt_rlp_equals_invalid_rlp_type() {
    let empty_string_rlp = [0x80]; // ""
    assert_receipt_rlp_equals(false, resize(empty_string_rlp), receipt);
}

#[test(should_fail_with="Invalid number of fields in receipt RLP")]
fn test_assert_receipt_rlp_equals_invalid_rlp_field_count() {
    let list_with_single_string = [0xc1, 0x80]; // [""]
    assert_receipt_rlp_equals(false, resize(list_with_single_string), receipt);
}

#[test(should_fail_with="State root: Invalid RLP type")]
fn test_assert_receipt_rlp_equals_invalid_state_root_type() {
    let state_root_is_a_list = [0xc4, 0xc0, 0x80, 0x80, 0x80]; // [[], "", "", ""]
    assert_receipt_rlp_equals(true, resize(state_root_is_a_list), pre_byzantium_receipt);
}

#[test(should_fail_with="State root: Invalid RLP length")]
fn test_assert_receipt_rlp_equals_invalid_state_root_length() {
    let state_root_too_short = [0xc4, 0x80, 0x80, 0x80, 0x80]; // ["", "", "", ""]
    assert_receipt_rlp_equals(true, resize(state_root_too_short), pre_byzantium_receipt);
}

#[test(should_fail_with="State root is missing")]
fn test_assert_receipt_rlp_equals_missing_state_root() {
    let mut receipt = pre_byzantium_receipt;
    receipt.state_root = Option::none();
    assert_receipt_rlp_equals(true, pre_byzantium_receipt_rlp, receipt);
}

#[test(should_fail_with="State root: Invalid RLP value")]
fn test_assert_receipt_rlp_equals_invalid_state_root_value() {
    let mut receipt = pre_byzantium_receipt;
    receipt.state_root = receipt.state_root.map(alter_array);
    assert_receipt_rlp_equals(true, pre_byzantium_receipt_rlp, receipt);
}

#[test(should_fail_with="Status: Invalid RLP type")]
fn test_assert_receipt_rlp_equals_invalid_status_type() {
    let status_is_a_list = [0xc4, 0xc0, 0x80, 0x80, 0x80]; // [[], "", "", ""]
    assert_receipt_rlp_equals(false, resize(status_is_a_list), receipt);
}

#[test(should_fail_with="Status: Invalid RLP length")]
fn test_assert_receipt_rlp_equals_invalid_status_length() {
    let status_too_short = [0xc4, 0x80, 0x80, 0x80, 0x80]; // ["", "", "", ""]
    assert_receipt_rlp_equals(false, resize(status_too_short), receipt);
}

#[test(should_fail_with="Status is missing")]
fn test_assert_receipt_rlp_equals_missing_status() {
    let mut receipt = receipt;
    receipt.status = Option::none();
    assert_receipt_rlp_equals(false, receipt_rlp, receipt);
}

#[test(should_fail_with="Status: Invalid RLP value")]
fn test_assert_receipt_rlp_equals_invalid_status_value() {
    let mut receipt = receipt;
    receipt.status = receipt.status.map(|status| 1 - status);
    assert_receipt_rlp_equals(false, receipt_rlp, receipt);
}

#[test(should_fail_with="Cumulative gas used: Invalid RLP type")]
fn test_assert_receipt_rlp_equals_invalid_cumulative_gas_used_type() {
    let cumulative_gas_used_is_a_list = [0xc4, 0x01, 0xc0, 0x80, 0x80]; // ["0x01", [], "", ""]
    assert_receipt_rlp_equals(false, resize(cumulative_gas_used_is_a_list), receipt);
}

#[test(should_fail_with="Cumulative gas used: Invalid RLP length")]
fn test_assert_receipt_rlp_equals_invalid_cumulative_gas_used_length() {
    let cumulative_gas_used_too_short = [0xc4, 0x01, 0x80, 0x80, 0x80]; // ["0x01", "", "", ""]
    assert_receipt_rlp_equals(false, resize(cumulative_gas_used_too_short), receipt);
}

#[test(should_fail_with="Cumulative gas used: Invalid RLP value)]
fn test_assert_receipt_rlp_equals_invalid_cumulative_gas_used_value() {
    let mut receipt = receipt;
    receipt.cumulative_gas_used = wrapping_add(receipt.cumulative_gas_used, 1);
    assert_receipt_rlp_equals(false, receipt_rlp, receipt);
}

#[test(should_fail_with="Logs bloom: Invalid RLP type")]
fn test_assert_receipt_rlp_equals_invalid_logs_bloom_type() {
    let logs_bloom_is_a_list = [0xc7, 0x01, 0x83, 0x0a, 0x17, 0xe1, 0xc0, 0x80]; // ["0x01", "0x0a17e1", [], ""]
    assert_receipt_rlp_equals(false, resize(logs_bloom_is_a_list), receipt);
}

#[test(should_fail_with="Logs bloom: Invalid RLP length")]
fn test_assert_receipt_rlp_equals_invalid_logs_bloom_length() {
    let logs_bloom_too_short = [0xc7, 0x01, 0x83, 0x0a, 0x17, 0xe1, 0x80, 0x80]; // ["0x01", "0x0a17e1", "", ""]
    assert_receipt_rlp_equals(false, resize(logs_bloom_too_short), receipt);
}

#[test(should_fail_with="Logs bloom: Invalid RLP value")]
fn test_assert_receipt_rlp_equals_invalid_logs_bloom_value() {
    let mut receipt = receipt;
    receipt.logs_bloom = alter_array(receipt.logs_bloom);
    assert_receipt_rlp_equals(false, receipt_rlp, receipt);
}

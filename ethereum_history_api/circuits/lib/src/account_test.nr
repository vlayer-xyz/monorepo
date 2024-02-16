use crate::account::{Account, assert_account_equals, MAX_ACCOUNT_STATE_LENGTH};
use crate::HASH_LENGTH;
use crate::misc::arrays::alter_array;
use crate::fixtures::account::{rlp_encoded_left_padded_account, account, balance, storage_root, code_hash, nonce};

#[test]
fn test_assert_account_equals() {
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Nonce length mismatch")]
fn test_assert_account_equals_nonce_with_wrong_length() {
    let nonce_with_wrong_length = 0;
    let account = Account { nonce: nonce_with_wrong_length, balance, storage_root, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Nonce mismatch")]
fn test_assert_account_equals_nonce_with_wrong_value() {
    let nonce_with_wrong_value = nonce + 1;
    let account = Account { nonce: nonce_with_wrong_value, balance, storage_root, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Balance length mismatch")]
fn test_assert_account_equals_balance_with_wrong_length() {
    let balance_with_wrong_length = 0;
    let account = Account { nonce, balance: balance_with_wrong_length, storage_root, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Balance mismatch")]
fn test_assert_account_equals_balance_with_wrong_value() {
    let balance_with_wrong_value = balance + 1;
    let account = Account { nonce, balance: balance_with_wrong_value, storage_root, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Storage root mismatch")]
fn test_assert_account_equals_storage_root_with_wrong_value() {
    let storage_root_with_wrong_value = alter_array(storage_root);
    let account = Account { nonce, balance, storage_root: storage_root_with_wrong_value, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Code hash mismatch")]
fn test_assert_account_equals_code_hash_with_wrong_value() {
    let code_hash_with_wrong_value = alter_array(code_hash);
    let account = Account { nonce, balance, storage_root, code_hash: code_hash_with_wrong_value };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

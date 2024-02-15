use crate::get_account::{Account, assert_account_equals, MAX_ACCOUNT_STATE_LENGTH};
use crate::HASH_LENGTH;
use crate::arrays::alter_array;

global rlp_encoded_left_padded_account: [u8; MAX_ACCOUNT_STATE_LENGTH] = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    248,
        78,
            1,
        138,
            3, 19, 87, 10, 132, 191, 55, 142, 253, 37,
        160,
            174, 39, 146, 36, 68, 23, 188, 23,
            73, 185, 205, 154, 11, 220, 28, 74,
            108, 243, 47, 20, 123, 55, 32, 44,
            140, 179, 89, 7, 119, 101, 154, 236,
        160,
            226, 231, 167, 82, 74, 152, 206, 98,
            158, 228, 6, 193, 92, 81, 166, 131,
            228, 22, 127, 11, 116, 234, 35, 5,
            102, 221, 236, 231, 174, 157, 111, 11,
];

global nonce: u64 = 1;
global balance: u120 = 0x0313570a84bf378efd25;
global storage_root: [u8; HASH_LENGTH] = [
    174, 39, 146, 36, 68, 23, 188, 23,
    73, 185, 205, 154, 11, 220, 28, 74,
    108, 243, 47, 20, 123, 55, 32, 44,
    140, 179, 89, 7, 119, 101, 154, 236
];
global code_hash: [u8; HASH_LENGTH] = [
    226, 231, 167, 82, 74, 152, 206, 98,
    158, 228, 6, 193, 92, 81, 166, 131,
    228, 22, 127, 11, 116, 234, 35, 5,
    102, 221, 236, 231, 174, 157, 111, 11
];

#[test]
fn test_assert_account_equals() {
    let account = Account { nonce, balance, storage_root, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Nonce length mismatch")]
fn test_assert_account_equals_nonce_with_wrong_length() {
    let nonce_with_wrong_length = 0;
    let account = Account { nonce: nonce_with_wrong_length, balance, storage_root, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "subarray not equals")]
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

#[test(should_fail_with = "subarray not equals")]
fn test_assert_account_equals_balance_with_wrong_value() {
    let balance_with_wrong_value = balance + 1;
    let account = Account { nonce, balance: balance_with_wrong_value, storage_root, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "subarray not equals")]
fn test_assert_account_equals_storage_root_with_wrong_value() {
    let storage_root_with_wrong_value = alter_array(storage_root);
    let account = Account { nonce, balance, storage_root: storage_root_with_wrong_value, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "subarray not equals")]
fn test_assert_account_equals_code_hash_with_wrong_value() {
    let code_hash_with_wrong_value = alter_array(code_hash);
    let account = Account { nonce, balance, storage_root, code_hash: code_hash_with_wrong_value };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

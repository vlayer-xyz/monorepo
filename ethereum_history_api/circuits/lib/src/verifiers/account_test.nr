use crate::account_with_storage::{Account, MAX_ACCOUNT_STATE_LENGTH, verify_account};
use crate::fixtures::{
    mainnet::london::{
    crypto_punks::{
    account::{rlp_encoded_left_padded_account, account, balance, storage_root, code_hash, nonce},
    header::state_root, state_proof::state_proof
}
}
};
use crate::misc::arrays::alter_array;
use crate::verifiers::account::assert_account_equals;

#[test]
fn test_assert_account_equals() {
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

global RLP_SHORT_STRING_TYPE = 0x80;

#[test(should_fail_with = "Expected a list")]
fn test_account_rlp_invalid_type() {
    let mut rlp_empty_string_encoding = [0; MAX_ACCOUNT_STATE_LENGTH];
    rlp_empty_string_encoding[MAX_ACCOUNT_STATE_LENGTH - 1] = RLP_SHORT_STRING_TYPE;
    assert_account_equals(rlp_empty_string_encoding, account)
}

#[test(should_fail_with = "Invalid number of fields in account RLP")]
fn test_account_rlp_invalid_field_count() {
    let rlp_encoded_left_padded_account_with_invalid_field_count = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 237, 1, 138, 3, 19, 87, 10, 132, 191, 55, 142, 253, 37, 160, 174, 39, 146, 36, 68, 17, 188, 174, 73, 185, 205, 154, 11, 220, 28, 74, 108, 243, 47, 20, 123, 67, 32, 44, 140, 179, 89, 7, 118, 89, 174, 202
    ];
    assert_account_equals(
        rlp_encoded_left_padded_account_with_invalid_field_count,
        account
    )
}

#[test(should_fail_with = "Nonce: Invalid RLP length")]
fn test_assert_account_equals_nonce_with_wrong_length() {
    let nonce_with_wrong_length = 0;
    let account = Account { nonce: nonce_with_wrong_length, balance, storage_root, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Nonce: Invalid RLP value")]
fn test_assert_account_equals_nonce_with_wrong_value() {
    let nonce_with_wrong_value = nonce + 1;
    let account = Account { nonce: nonce_with_wrong_value, balance, storage_root, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Balance: Invalid RLP length")]
fn test_assert_account_equals_balance_with_wrong_length() {
    let balance_with_wrong_length = U128::from_integer(0);
    let account = Account { nonce, balance: balance_with_wrong_length, storage_root, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Balance: Invalid RLP value")]
fn test_assert_account_equals_balance_with_wrong_value() {
    let balance_with_wrong_value = balance + U128::from_integer(1);
    let account = Account { nonce, balance: balance_with_wrong_value, storage_root, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Storage root: Invalid RLP value")]
fn test_assert_account_equals_storage_root_with_wrong_value() {
    let storage_root_with_wrong_value = alter_array(storage_root);
    let account = Account { nonce, balance, storage_root: storage_root_with_wrong_value, code_hash };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test(should_fail_with = "Code hash: Invalid RLP value")]
fn test_assert_account_equals_code_hash_with_wrong_value() {
    let code_hash_with_wrong_value = alter_array(code_hash);
    let account = Account { nonce, balance, storage_root, code_hash: code_hash_with_wrong_value };
    assert_account_equals(rlp_encoded_left_padded_account, account);
}

#[test]
fn test_verify_account() {
    let _ = verify_account(state_proof.key, account, state_proof, state_root);
}

#[test(should_fail_with="Address mismatch")]
fn test_verify_account_wrong_address() {
    let mut wrong_address = state_proof.key;
    wrong_address[0] += 1;
    let _ = verify_account(wrong_address, account, state_proof, state_root);
}

// TODO: Add correct assertion message when noir-trie-proofs is updated
#[test(should_fail)]
fn test_verify_account_wrong_state_proof() {
    let mut wrong_proof = state_proof;
    wrong_proof.proof[0] += 1;
    let _ = verify_account(state_proof.key, account, wrong_proof, state_root);
}

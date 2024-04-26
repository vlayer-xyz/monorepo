use dep::proof::{const::{MAX_ACCOUNT_STATE_LENGTH, HASH_LENGTH}, trie_proof::TrieProof};
use dep::u2b::u64_to_u8;

use crate::account::{Account, StateProof};
use crate::misc::{arrays::sub_array_equals_up_to_length, types::{Address, Bytes32}, bytes::byte_value};
use crate::rlp::decode::decode_list_of_small_strings;
use crate::rlp::types::RlpList;

use crate::HASH_LEN;

global ACCOUNT_FIELDS_COUNT = 4;
global NONCE_INDEX  = 0;
global BALANCE_INDEX = 1;
global STORAGE_ROOT_INDEX = 2;
global CODE_HASH_INDEX = 3;

pub(crate) fn assert_account_equals(account_rlp_left_padded: [u8; MAX_ACCOUNT_STATE_LENGTH], account: Account) {
    let account_rlp_right_padded = byte_value(account_rlp_left_padded).storage;
    let account_rlp_list: RlpList<ACCOUNT_FIELDS_COUNT> = decode_list_of_small_strings(account_rlp_right_padded);
    assert(account_rlp_list.len == ACCOUNT_FIELDS_COUNT, "Invalid number of fields in account RLP");

    let nonce = u64_to_u8(account.nonce);
    let nonce = byte_value(nonce);
    let balance = U128::from_integer(account.balance).to_be_bytes();
    let balance = byte_value(balance);

    account_rlp_list.get(NONCE_INDEX).assert_string_eq("Nonce", account_rlp_right_padded, nonce);
    account_rlp_list.get(BALANCE_INDEX).assert_string_eq("Balance", account_rlp_right_padded, balance);

    account_rlp_list.get(STORAGE_ROOT_INDEX).assert_string_eq(
        "Storage root",
        account_rlp_right_padded,
        BoundedVec { storage: account.storage_root, len: HASH_LEN }
    );
    account_rlp_list.get(CODE_HASH_INDEX).assert_string_eq(
        "Code hash",
        account_rlp_right_padded,
        BoundedVec { storage: account.code_hash, len: HASH_LEN }
    );
}

fn assert_address_equals(address1: Address, address2: Address) {
    assert_eq(address1, address2, "Address mismatch");
}

fn assert_account_proof(account_state_proof: StateProof, state_root: [u8; HASH_LENGTH]) {
    let trie_proof = TrieProof {
        key: account_state_proof.key,
        proof: account_state_proof.proof,
        depth: account_state_proof.depth,
        value: account_state_proof.value
    };
    assert(trie_proof.verify_state_root(state_root), "TrieProof: Invalid state root");
}

pub fn verify_account(
    address: Address,
    account: Account,
    state_proof: StateProof,
    state_root: [u8; HASH_LENGTH]
) {
    assert_address_equals(state_proof.key, address);
    assert_account_equals(state_proof.value, account);
    assert_account_proof(state_proof, state_root);
}

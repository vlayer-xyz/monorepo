use dep::proof::{const::{MAX_ACCOUNT_STATE_LENGTH, HASH_LENGTH}, trie_proof::TrieProof};

use crate::account::{Account, StateProof};
use crate::misc::{types::Address, bytes::right_pad, fragment::Fragment};
use crate::rlp::decode::decode_list_of_small_strings;
use crate::rlp::types::RlpList;

use crate::HASH_LEN;

global ACCOUNT_FIELDS_COUNT = 4;
global NONCE_INDEX  = 0;
global BALANCE_INDEX = 1;
global STORAGE_ROOT_INDEX = 2;
global CODE_HASH_INDEX = 3;

pub(crate) fn assert_account_equals(account_rlp_left_padded: [u8; MAX_ACCOUNT_STATE_LENGTH], account: Account) {
    let account_rlp_right_padded = right_pad(account_rlp_left_padded).storage;
    let account_rlp_list: RlpList<ACCOUNT_FIELDS_COUNT> = decode_list_of_small_strings(Fragment::from_array(account_rlp_right_padded));
    assert(account_rlp_list.len == ACCOUNT_FIELDS_COUNT, "Invalid number of fields in account RLP");

    account_rlp_list.get(NONCE_INDEX).assert_eq_u64("Nonce", account_rlp_right_padded, account.nonce as u64);
    account_rlp_list.get(BALANCE_INDEX).assert_eq_u128(
        "Balance",
        account_rlp_right_padded,
        U128::from_integer(account.balance)
    );

    account_rlp_list.get(STORAGE_ROOT_INDEX).assert_eq_bytes32("Storage root", account_rlp_right_padded, account.storage_root);
    account_rlp_list.get(CODE_HASH_INDEX).assert_eq_bytes32("Code hash", account_rlp_right_padded, account.code_hash);
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

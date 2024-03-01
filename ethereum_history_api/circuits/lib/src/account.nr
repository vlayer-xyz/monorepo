use dep::proof::{rlp::{RLP_List, decode1_small_lis}, MAX_ACCOUNT_STATE_LENGTH, KEY_LENGTH, TrieProof, byte_value};
use dep::std::println;
use dep::u2b::{u64_to_u8, u120_to_u8};
use crate::misc::arrays::{alter_array, sub_array_equals_up_to_length, array_equals};
use crate::HASH_LENGTH;
use crate::header::get_header;
use crate::misc::types::{Address, Bytes32};

global STATE_PROOF_LEN = 4788; // = 9 (MAX_STATE_PROOF_LEVELS) * 532 (MAX_TRIE_NODE_LENGTH)

struct Account {
    nonce: Field,
    balance: Field,
    storage_root: Bytes32,
    code_hash: Bytes32,
}

struct StateProof {
    key: Address,
    value: [u8; MAX_ACCOUNT_STATE_LENGTH],
    proof: [u8; STATE_PROOF_LEN],
    depth: Field,
}

struct AccountWithinBlock {
    account: Account,
    block_hash: Bytes32,
}

type AccountWithStateProof = (Account, StateProof);

pub fn get_account(block_no: Field, address: Address) -> AccountWithinBlock {
    let (account, state_proof) = get_account_unconstrained(block_no, address);
    let header = get_header(block_no);
    verify_account(address, account, state_proof, header.state_root);
    AccountWithinBlock {
        account,
        block_hash: header.hash
    }
}

#[oracle(get_account)]
unconstrained fn get_account_oracle(_block_no: Field, _address: [u8; 20]) -> AccountWithStateProof {}

unconstrained fn get_account_unconstrained(
    block_no: Field,
    address: Address
) -> AccountWithStateProof {
    get_account_oracle(block_no, address)
}

global ACCOUNT_FIELDS_COUNT = 4;
global NONCE_INDEX  = 0;
global BALANCE_INDEX = 1;
global STORAGE_ROOT_INDEX = 2;
global CODE_HASH_INDEX = 3;

pub(crate) fn assert_account_equals(account_rlp_left_padded: [u8; MAX_ACCOUNT_STATE_LENGTH], account: Account) {
    let account_rlp_right_padded = byte_value(account_rlp_left_padded).0;
    let account_rlp: RLP_List<ACCOUNT_FIELDS_COUNT> = decode1_small_lis(account_rlp_right_padded);
    assert(account_rlp.num_fields == ACCOUNT_FIELDS_COUNT, "Invalid number of fields in account RLP");

    let nonce = u64_to_u8(account.nonce as u64);
    let (nonce, nonce_length) = byte_value(nonce);
    let balance = u120_to_u8(account.balance as u120);
    let (balance, balance_length) = byte_value(balance);

    assert(account_rlp.length[NONCE_INDEX] == nonce_length, "Nonce length mismatch");
    assert(
        sub_array_equals_up_to_length(
            nonce,
            account_rlp_right_padded,
            account_rlp.offset[NONCE_INDEX],
            nonce_length as u64
        ), "Nonce mismatch"
    );

    assert(account_rlp.length[BALANCE_INDEX] == balance_length, "Balance length mismatch");
    assert(
        sub_array_equals_up_to_length(
            balance,
            account_rlp_right_padded,
            account_rlp.offset[BALANCE_INDEX],
            balance_length as u64
        ), "Balance mismatch"
    );

    assert(account_rlp.length[STORAGE_ROOT_INDEX] == HASH_LENGTH, "Storage root length mismatch");
    assert(
        sub_array_equals_up_to_length(
            account.storage_root,
            account_rlp_right_padded,
            account_rlp.offset[STORAGE_ROOT_INDEX],
            HASH_LENGTH as u64
        ), "Storage root mismatch"
    );

    assert(account_rlp.length[CODE_HASH_INDEX] == HASH_LENGTH, "Code hash length mismatch");
    assert(
        sub_array_equals_up_to_length(
            account.code_hash,
            account_rlp_right_padded,
            account_rlp.offset[CODE_HASH_INDEX],
            HASH_LENGTH as u64
        ), "Code hash mismatch"
    );
}

fn assert_address_equals(address1: Address, address2: Address) {
    assert(array_equals(address1, address2), "Address mismatch");
}

fn assert_account_proof(account_state_proof: StateProof, state_root: [u8; KEY_LENGTH]) {
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
    state_root: [u8; KEY_LENGTH]
) {

    assert_address_equals(state_proof.key, address);
    assert_account_equals(state_proof.value, account);
    assert_account_proof(state_proof, state_root);
}

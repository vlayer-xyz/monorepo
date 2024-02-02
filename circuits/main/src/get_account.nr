use dep::proof::{rlp::{RLP_List, decode1_small_lis}, MAX_ACCOUNT_STATE_LENGTH, KEY_LENGTH, TrieProof, byte_value};
use dep::std::println;
use crate::arrays::{assert_sub_array_equals};
use dep::u2b::{u64_to_u8, u120_to_u8};
use crate::HASH_LENGTH;
use crate::arrays::alter_array;

global PROOF_LEN = 4256;

struct Account {
    nonce: u64,
    balance: u120,
    state_root: [u8; HASH_LENGTH],
    code_hash: [u8; HASH_LENGTH],
}

struct AccountWithProof {
    nonce: u64,
    balance: u120,
    state_root: [u8; HASH_LENGTH],
    code_hash: [u8; HASH_LENGTH],
    
    key: [u8; 20],
    value: [u8; MAX_ACCOUNT_STATE_LENGTH],
    proof: [u8; PROOF_LEN],
    depth: Field,
}

#[oracle(get_account)]
unconstrained fn get_account_oracle(_block_no: Field, _address: [u8; 20]) -> AccountWithProof {}

unconstrained fn get_account_unconstrained(block_no: Field, address: [u8; 20]) -> AccountWithProof {
    get_account_oracle(block_no, address)
}

global ACCOUNT_FIELDS_COUNT = 4;
global NONCE_INDEX  = 0;
global BALANCE_INDEX = 1;
global STATE_ROOT_INDEX = 2;
global CODE_HASH_INDEX = 3;

pub(crate) fn assert_account_equals(encoded: [u8; MAX_ACCOUNT_STATE_LENGTH], account: Account) {
    let account_value = byte_value(encoded).0;
    let account_rlp: RLP_List<ACCOUNT_FIELDS_COUNT> = decode1_small_lis(account_value);
    let nonce = u64_to_u8(account.nonce);
    let (nonce, nonce_length) = byte_value(nonce);
    let balance = u120_to_u8(account.balance);
    let (balance, balance_length) = byte_value(balance);

    assert(account_rlp.length[NONCE_INDEX] == nonce_length, "Nonce length mismatch");
    assert_sub_array_equals(
        nonce,
        account_value,
        account_rlp.offset[NONCE_INDEX],
        nonce_length as u64
    );

    assert(account_rlp.length[BALANCE_INDEX] == balance_length, "Balance length mismatch");
    assert_sub_array_equals(
        balance,
        account_value,
        account_rlp.offset[BALANCE_INDEX],
        balance_length as u64
    );

    assert(account_rlp.length[STATE_ROOT_INDEX] == HASH_LENGTH, "State root length mismatch");
    assert_sub_array_equals(
        account.state_root,
        account_value,
        account_rlp.offset[STATE_ROOT_INDEX],
        HASH_LENGTH as u64
    );

    assert(account_rlp.length[CODE_HASH_INDEX] == HASH_LENGTH, "Code hash length mismatch");
    assert_sub_array_equals(
        account.code_hash,
        account_value,
        account_rlp.offset[CODE_HASH_INDEX],
        HASH_LENGTH as u64
    );
}

unconstrained fn assert_account_proof(
    account_with_proof: AccountWithProof,
    state_root: [u8; KEY_LENGTH]
) {
    let trie_proof = TrieProof {
        key: account_with_proof.key,
        proof: account_with_proof.proof,
        depth: account_with_proof.depth,
        value: account_with_proof.value
    };
    assert(trie_proof.verify_state_root(state_root), "TrieProof: Invalid state root");
}

pub(crate) fn get_account(block_no: Field, address: [u8; 20], state_root: [u8; KEY_LENGTH]) -> Account {
    let account_with_proof = get_account_unconstrained(block_no, address);

    let account = Account {
        nonce: account_with_proof.nonce,
        balance: account_with_proof.balance,
        state_root: account_with_proof.state_root,
        code_hash: account_with_proof.code_hash
    };
    assert_account_equals(account_with_proof.value, account);
    assert_account_proof(account_with_proof, state_root);

    account
}

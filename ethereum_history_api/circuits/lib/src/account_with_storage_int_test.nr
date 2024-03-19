use crate::misc::types::Bytes32;
use crate::account_with_storage::{StorageProof, get_account_with_storage};
use crate::fixtures::mainnet::{
    paris::{
    usdc::{
    header::{number, state_root, block_header_partial, block_header_rlp}, account::account,
    state_proof::state_proof, storage_proof::proofs
}
},
    london::{
    crypto_punks::{
    header::{
    block_header_partial as crypto_punks_block_header_partial,
    block_header_rlp as crypto_punks_block_header_rlp
},
    account::account as crypto_punks_account, state_proof::state_proof as crypto_punks_state_proof
}
}
};
use dep::std::test::OracleMock;

#[test]
fn test_get_account_with_storage_success() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));
    let _ = OracleMock::mock("get_proof").returns((account, state_proof, proofs[0]));

    let address = state_proof.key;
    let storage_key = proofs[0].key;
    let account_with_storage = get_account_with_storage(number, address, storage_key);

    assert_eq(block_header_partial.hash, account_with_storage.block_hash);

    assert_eq(account.nonce, account_with_storage.account.nonce);
    assert_eq(account.balance, account_with_storage.account.balance);
    assert_eq(account.code_hash, account_with_storage.account.code_hash);
    assert_eq(account.storage_root, account_with_storage.account.storage_root);

    assert_eq(proofs[0].value, account_with_storage.values[0]);
}
// TODO: Add a failure message for the tests once the enhancements in PR https://github.com/aragonzkresearch/noir-trie-proofs/pull/15 are integrated.
#[test(should_fail)]
fn test_get_account_with_storage_invalid_state_root() {
    let _ = OracleMock::mock("get_header").returns((crypto_punks_block_header_partial, crypto_punks_block_header_rlp));
    let _ = OracleMock::mock("get_proof").returns((account, state_proof, proofs[0]));

    let address = state_proof.key;
    let storage_key = proofs[0].key;
    let _ = get_account_with_storage(crypto_punks_number, address, storage_key);
}

#[test(should_fail_with = "Middle node hash does not match the hash extracted from the preceding node")]
fn test_get_account_with_storage_invalid_storage_root() {
    let _ = OracleMock::mock("get_header").returns((crypto_punks_block_header_partial, crypto_punks_block_header_rlp));
    let _ = OracleMock::mock("get_proof").returns((crypto_punks_account, crypto_punks_state_proof, proofs[0]));

    let address = crypto_punks_state_proof.key;
    let storage_key = proofs[0].key;
    let _ = get_account_with_storage(number, address, storage_key);
}

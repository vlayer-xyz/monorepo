use crate::account::get_account;
use crate::chain::ETHEREUM_MAINNET_ID;
use crate::fixtures::mainnet::{
    paris::{
    usdc_circle::{
    header::{number, state_root, block_header_partial, block_header_rlp}, account::account,
    state_proof::state_proof
}
},
    london::vitalik_balance::{
    account::account as account_from_different_header,
    header::state_root as state_root_from_different_header,
    state_proof::state_proof as state_proof_from_different_header
}
};
use dep::std::test::OracleMock;

#[test]
fn test_get_account_success() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));
    let _ = OracleMock::mock("get_account").returns((account, state_proof));

    let account_within_block = get_account(ETHEREUM_MAINNET_ID, number, state_proof.key);

    assert_eq(account.nonce, account_within_block.account.nonce);
    assert_eq(account.balance, account_within_block.account.balance);
    assert_eq(account.code_hash, account_within_block.account.code_hash);
    assert_eq(account.storage_root, account_within_block.account.storage_root);

    assert_eq(block_header_partial.hash, account_within_block.block_hash);
}

#[test(should_fail)]
fn test_get_account_wrong_state_root() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));
    let _ = OracleMock::mock("get_account").returns((account_from_different_header, state_proof_from_different_header));

    let _ = get_account(
        ETHEREUM_MAINNET_ID,
        number,
        state_proof_from_different_header.key
    );
}

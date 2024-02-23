use crate::account::verify_account;
use crate::fixtures::{
    paris::{
        one_inch::{
            header::{
                number, state_root, block_header_partial, block_header_rlp
            },
            account::account,
            state_proof::state_proof
        }
    },
    london::vitalik_balance::{
        account::{account as account_from_different_header},
        header::state_root as state_root_from_different_header,
        state_proof::state_proof as state_proof_from_different_header
    }
};
use dep::std::test::OracleMock;

#[test]
fn test_verify_account() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));

    let _ = verify_account(number, account, state_proof, state_root);
}

#[test(should_fail_with = "State root does not match")]
fn test_verify_account_wrong_state_root() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));

    let _ = verify_account(
        number,
        account_from_different_header,
        state_proof_from_different_header,
        state_root_from_different_header
    );
}

use crate::account::verify_account;
use crate::fixtures::{
    london::{
        crypto_punks::{
            header::{number, state_root, block_header_partial, block_header_rlp},
            account::account,
            state_proof::state_proof
        }
    },
    paris::{
        one_inch::header::{
            number as paris_number,
            block_header_partial as paris_block_header_partial,
            block_header_rlp as paris_block_header_rlp,
        }
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
    let _ = OracleMock::mock("get_header").returns((paris_block_header_partial, paris_block_header_rlp));

    let _ = verify_account(paris_number, account, state_proof, state_root);
}

use crate::header::{verify_header, BlockHeaderPartial, BlockHeaderRlp, MAX_HEADER_RLP_SIZE};
use crate::misc::arrays::alter_array;
use crate::fixtures::{
    london::crypto_punks::header::{
        block_header_partial as london_block_header_partial,
        block_header_rlp as london_block_header_rlp,
    },
    frontier::first::header::{
        block_header_partial as frontier_block_header_partial,
        block_header_rlp as frontier_block_header_rlp,
    },
    paris::one_inch::header::{
        block_header_partial as paris_block_header_partial,
        block_header_rlp as paris_block_header_rlp,
    },
    paris::one_inch::header::{
        hash, number, state_root, transactions_root, receipts_root
    },
};

#[test]
    fn test_verify_frontier_header_success() {
    verify_header(frontier_block_header_partial, frontier_block_header_rlp);
}

#[test]
    fn test_verify_london_header_success() {
    verify_header(london_block_header_partial, london_block_header_rlp);
}

#[test]
    fn test_verify_paris_header_success() {
    verify_header(paris_block_header_partial, paris_block_header_rlp);
}

#[test(should_fail_with = "block number does not match")]
fn test_verify_header_invalid_block_number() {
    let wrong_number = number + 1;
    let paris_block_header_partial = BlockHeaderPartial { number: wrong_number, hash, state_root, transactions_root, receipts_root };
    verify_header(paris_block_header_partial, paris_block_header_rlp);
}

#[test(should_fail_with = "block number length does not match")]
fn test_verify_header_invalid_block_number_length() {
    let wrong_number_length = 0;
    let paris_block_header_partial = BlockHeaderPartial { number: wrong_number_length, hash, state_root, transactions_root, receipts_root };
    verify_header(paris_block_header_partial, paris_block_header_rlp);
}

#[test(should_fail_with = "block hash does not match")]
fn test_verify_header_invalid_hash() {
    let hash = alter_array(hash);
    let paris_block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(paris_block_header_partial, paris_block_header_rlp);
}

#[test(should_fail_with = "state_root does not match")]
fn test_verify_header_invalid_state_root() {
    let state_root = alter_array(state_root);
    let paris_block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(paris_block_header_partial, paris_block_header_rlp);
}

#[test(should_fail_with = "transactions_root does not match")]
fn test_verify_header_invalid_transactions_root() {
    let transactions_root = alter_array(transactions_root);
    let paris_block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(paris_block_header_partial, paris_block_header_rlp);
}

#[test(should_fail_with = "receipts_root does not match")]
fn test_verify_header_invalid_receipt_root() {
    let receipts_root = alter_array(receipts_root);
    let paris_block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(paris_block_header_partial, paris_block_header_rlp);
}

#[test(should_fail)] // TODO: Add correct assertion message when we migrate to Noir >=0.24.0 which fixes assertions order
fn test_verify_header_invalid_rlp() {
    let mut rlp_empty_string_encoding = [0; MAX_HEADER_RLP_SIZE];
    rlp_empty_string_encoding[0] = 0x80;
    let malformed_block_header_rlp = BlockHeaderRlp { data: rlp_empty_string_encoding, length: 1 };
    let paris_block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(paris_block_header_partial, malformed_block_header_rlp);
}

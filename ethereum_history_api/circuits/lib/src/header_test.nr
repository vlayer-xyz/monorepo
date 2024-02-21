use dep::std::test::OracleMock;
use crate::header::{get_header, verify_header, BlockHeaderPartial, BlockHeaderRlp};
use crate::misc::arrays::alter_array;
use crate::fixtures::london::crypto_punks::header::{block_header_partial, block_header_rlp, hash, number, state_root, transactions_root, receipts_root};

#[test]
fn test_get_header_success() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));
    let header = get_header(0);
    assert_eq(block_header_partial.number, header.number);
    assert_eq(block_header_partial.hash, header.hash);
    assert_eq(block_header_partial.state_root, header.state_root);
    assert_eq(block_header_partial.transactions_root, header.transactions_root);
    assert_eq(block_header_partial.receipts_root, header.receipts_root);
}

#[test]
fn test_verify_header_success() {
    verify_header(block_header_partial, block_header_rlp);
}

#[test(should_fail_with = "block number does not match")]
fn test_verify_header_invalid_block_number() {
    let wrong_number = 2;
    let block_header_partial = BlockHeaderPartial { number: wrong_number, hash, state_root, transactions_root, receipts_root };
    verify_header(block_header_partial, block_header_rlp);
}

#[test(should_fail_with = "block number length does not match")]
fn test_verify_header_invalid_block_number_length() {
    let wrong_number_length = 0;
    let block_header_partial = BlockHeaderPartial { number: wrong_number_length, hash, state_root, transactions_root, receipts_root };
    verify_header(block_header_partial, block_header_rlp);
}

#[test(should_fail_with = "block hash does not match")]
fn test_verify_header_invalid_hash() {
    let hash = alter_array(hash);
    let block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(block_header_partial, block_header_rlp);
}

#[test(should_fail_with = "state_root does not match")]
fn test_verify_header_invalid_state_root() {
    let state_root = alter_array(state_root);
    let block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(block_header_partial, block_header_rlp);
}

#[test(should_fail_with = "transactions_root does not match")]
fn test_verify_header_invalid_transactions_root() {
    let transactions_root = alter_array(transactions_root);
    let block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(block_header_partial, block_header_rlp);
}

#[test(should_fail_with = "receipts_root does not match")]
fn test_verify_header_invalid_receipt_root() {
    let receipts_root = alter_array(receipts_root);
    let block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(block_header_partial, block_header_rlp);
}

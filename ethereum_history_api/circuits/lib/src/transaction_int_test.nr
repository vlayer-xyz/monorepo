use crate::transaction::{get_transaction, TransactionWithinBlock, PhantomTransactionProofLen, PhantomTransactionRlpLen};
use crate::fixtures::mainnet::{
    cancun::small_block::{
    header::{number, block_header_partial, block_header_rlp},
    transaction::{tx_idx, tx_type, transaction, transaction_foreign}, transaction_proof::proof
},
    homestead::fork::{
    header::{
    number as fork_number, block_header_partial as fork_block_header_partial,
    block_header_rlp as fork_block_header_rlp
},
    transaction::{tx_idx as fork_tx_idx, tx_type as fork_tx_type, transaction_foreign as fork_transaction_foreign},
    transaction_proof::proof as fork_proof
}
};
use dep::std::test::OracleMock;

global MAX_DATA_LEN = 1000;
global phantom_transaction_proof_len: PhantomTransactionProofLen<3724> = PhantomTransactionProofLen {}; //= 7 (MAX_TREE_DEPTH) * 532 (MAX_TRIE_NODE_LEN)
global phantom_transaction_rlp_len: PhantomTransactionRlpLen<525> = PhantomTransactionRlpLen {};
global chain_id: Field = 1;

#[test]
fn get_transaction_success() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));
    let _ = OracleMock::mock("get_transaction").returns((tx_type, transaction_foreign, proof));

    let transaction_within_block: TransactionWithinBlock<MAX_DATA_LEN> = get_transaction(
        chain_id,
        number,
        tx_idx,
        phantom_transaction_proof_len,
        phantom_transaction_rlp_len
    );

    assert_eq(transaction_within_block.block_hash, block_header_partial.hash);
    assert_eq(transaction_within_block.transaction.nonce, transaction_foreign.nonce);
    assert_eq(transaction_within_block.transaction.gas_limit, transaction_foreign.gas_limit);
    assert_eq(transaction_within_block.transaction.to.expect(f"to is missing"), transaction_foreign.to);
    assert_eq(
        transaction_within_block.transaction.value, U128::from_u64s_be(transaction_foreign.value_hi, transaction_foreign.value_lo)
    );
    assert_eq(transaction_within_block.transaction.data.storage, transaction_foreign.data);
    assert_eq(transaction_within_block.transaction.data.len, transaction_foreign.data_len);
    assert_eq(transaction_within_block.transaction.v, transaction_foreign.v);
    assert_eq(transaction_within_block.transaction.r, transaction_foreign.r);
    assert_eq(transaction_within_block.transaction.s, transaction_foreign.s);
}

#[test(should_fail_with = "Block number does not match the argument")]
fn get_transaction_wrong_block_number() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));
    let _ = OracleMock::mock("get_transaction").returns((tx_type, transaction_foreign, proof));

    let wrong_number = number + 1;
    let _: TransactionWithinBlock<MAX_DATA_LEN> = get_transaction(
        chain_id,
        wrong_number,
        tx_idx,
        phantom_transaction_proof_len,
        phantom_transaction_rlp_len
    );
}

#[test(should_fail_with = "Key does not match rlp-encoded transaction index")]
fn get_transaction_wrong_tx_idx() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));
    let _ = OracleMock::mock("get_transaction").returns((tx_type, transaction_foreign, proof));

    let wrong_tx_idx = tx_idx + 1;
    let _: TransactionWithinBlock<MAX_DATA_LEN> = get_transaction(
        chain_id,
        number,
        wrong_tx_idx,
        phantom_transaction_proof_len,
        phantom_transaction_rlp_len
    );
}

#[test(should_fail_with = "Internal node hash does not match the hash extracted from the preceding node")]
fn get_transaction_wrong_transaction() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));
    let _ = OracleMock::mock("get_transaction").returns((fork_tx_type, fork_transaction_foreign, fork_proof));

    let _: TransactionWithinBlock<MAX_DATA_LEN> = get_transaction(
        chain_id,
        number,
        fork_tx_idx,
        phantom_transaction_proof_len,
        phantom_transaction_rlp_len
    );
}

#[test(should_fail_with = "Internal node hash does not match the hash extracted from the preceding node")]
fn get_transaction_wrong_header() {
    let _ = OracleMock::mock("get_header").returns((fork_block_header_partial, fork_block_header_rlp));
    let _ = OracleMock::mock("get_transaction").returns((tx_type, transaction_foreign, proof));

    let _: TransactionWithinBlock<MAX_DATA_LEN> = get_transaction(
        chain_id,
        fork_number,
        tx_idx,
        phantom_transaction_proof_len,
        phantom_transaction_rlp_len
    );
}

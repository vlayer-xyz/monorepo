use crate::transaction::{get_transaction, TransactionWithinBlock, PhantomTransactionProofLen, PhantomTransactionRlpLen};
use crate::fixtures::mainnet::cancun::small_block::{
    header::{number, block_header_partial, block_header_rlp},
    transaction::{tx_idx, tx_type, transaction, transaction_foreign}, transaction_proof::proof
};
use dep::std::test::OracleMock;

global MAX_DATA_LEN = 1000;
global phantom_transaction_proof_len: PhantomTransactionProofLen<3724> = PhantomTransactionProofLen {}; // 7 *
global phantom_transaction_rlp_len: PhantomTransactionRlpLen<525> = PhantomTransactionRlpLen {};
global chain_id: Field = 1;

#[test]
fn test_get_transaction_success() {
    let _ = OracleMock::mock("get_transaction").returns((tx_type, transaction_foreign, proof));
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));

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

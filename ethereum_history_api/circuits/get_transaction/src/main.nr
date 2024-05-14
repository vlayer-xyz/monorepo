use dep::ethereum_history_api::transaction::{get_transaction, TransactionWithinBlock, PhantomTransactionProofLen, PhantomTransactionRlpLen};

global MAX_DATA_LEN = 1000;
fn main(
    chain_id: pub Field,
    block_number: pub u64,
    tx_idx: pub Field
) -> pub TransactionWithinBlock<MAX_DATA_LEN> {
    let phantom_transaction_proof_len: PhantomTransactionProofLen <3724>  = PhantomTransactionProofLen {}; //= 7 (MAX_TREE_DEPTH) * 532 (MAX_TRIE_NODE_LEN)
    let phantom_transaction_rlp_len: PhantomTransactionRlpLen <525>  = PhantomTransactionRlpLen {};
    let transaction_within_block: TransactionWithinBlock<MAX_DATA_LEN> = get_transaction(
        chain_id,
        block_number,
        tx_idx,
        phantom_transaction_proof_len,
        phantom_transaction_rlp_len
    );
    transaction_within_block
}

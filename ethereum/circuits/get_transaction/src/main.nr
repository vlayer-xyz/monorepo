use dep::ethereum::transaction::{get_transaction, TransactionWithinBlock, MAX_TREE_DEPTH};
use dep::ethereum::verifiers::transaction::MAX_ENCODED_TX_LENGTH;
use dep::proof::const::MAX_TRIE_NODE_LENGTH;

global MAX_DATA_LEN_M = 1000;
global PROOF_LEN = MAX_TREE_DEPTH * MAX_TRIE_NODE_LENGTH;

fn main(
    chain_id: pub Field,
    block_number: pub u64,
    tx_idx: pub Field
) -> pub TransactionWithinBlock<MAX_DATA_LEN_M> {
    let transaction_within_block: TransactionWithinBlock<MAX_DATA_LEN_M> = get_transaction::<MAX_DATA_LEN_M, PROOF_LEN, MAX_ENCODED_TX_LENGTH>(
        chain_id,
        block_number,
        tx_idx
    );
    transaction_within_block
}

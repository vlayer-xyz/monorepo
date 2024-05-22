use dep::ethereum::transaction::{
    get_transaction, TransactionWithinBlock, PhantomTransactionProofLen, PhantomTransactionRlpLen,
    MAX_TREE_DEPTH
};
use dep::ethereum::verifiers::transaction::MAX_ENCODED_TX_LENGTH;
use dep::proof::const::MAX_TRIE_NODE_LENGTH;

global MAX_DATA_LEN_M = 1000;

fn main(
    chain_id: pub Field,
    block_number: pub u64,
    tx_idx: pub Field
) -> pub TransactionWithinBlock<MAX_DATA_LEN_M> {
    let phantom_transaction_proof_len: PhantomTransactionProofLen <MAX_TREE_DEPTH * MAX_TRIE_NODE_LENGTH>  = PhantomTransactionProofLen {};
    let phantom_transaction_rlp_len: PhantomTransactionRlpLen <MAX_ENCODED_TX_LENGTH>  = PhantomTransactionRlpLen {};
    let transaction_within_block: TransactionWithinBlock<MAX_DATA_LEN_M> = get_transaction(
        chain_id,
        block_number,
        tx_idx,
        phantom_transaction_proof_len,
        phantom_transaction_rlp_len
    );
    transaction_within_block
}

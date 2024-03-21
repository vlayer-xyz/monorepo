use dep::ethereum_history_api::receipt::{get_receipt, TxReceiptWithinBlock, PhantomReceiptProofLen, PhantomReceiptRlpLen, TxReceiptProof};

global LOG_NUM = 1;
global MAX_LOG_DATA_SIZE = 128; // 4 * 32 (Eth word length)
// MAX_RECEIPT_TRIE_NODE_LENGTH = Max(MAX_LEAF_LENGTH, MAX_BRANCH_LENGTH)
// Leafs can have arbitrary length and will be constrained by generics, but in normal case - branches are longer than leaves
// MAX_BRANCH_LENGTH = MAX_RLP_LIST_HEADER_LENGTH + 16 * MAX_RLP_ELEMENT_LENGTH + LENGTH_OF_NULL_ELEMENT
// MAX_RLP_LIST_HEADER_LENGTH = 1 + MAX_LENGTH_BYTES
// MAX_LENGTH_BYTES = 2
// MAX_RLP_LIST_HEADER_LENGTH = 3
// MAX_RLP_ELEMENT_LENGTH = 1 + 32
// LENGTH_OF_NULL_ELEMENT = 1
// MAX_BRANCH_LENGTH = 3 + 16 * 33 + 1 = 532
global MAX_RECEIPT_TRIE_NODE_LENGTH = 532;
global MAX_RECEIPT_PROOF_LENGTH = 3724; // MAX_RECEIPT_TRIE_NODE_LENGTH * MAX_RECEIPT_TREE_DEPTH
global MAX_RECEIPT_RLP_LENGTH = 532; // Needs to be the same as MAX_RECEIPT_TRIE_NODE_LENGTH

fn main(
    block_number: pub Field,
    tx_idx: pub Field
) -> pub TxReceiptWithinBlock<LOG_NUM, MAX_LOG_DATA_SIZE> {
    let max_receipt_proof_len: PhantomReceiptProofLen<MAX_RECEIPT_PROOF_LENGTH> = PhantomReceiptProofLen {};
    let max_receipt_rlp_length: PhantomReceiptRlpLen<MAX_RECEIPT_RLP_LENGTH> = PhantomReceiptRlpLen {};
    get_receipt(
        block_number,
        tx_idx,
        max_receipt_proof_len,
        max_receipt_rlp_length
    )
}

use dep::ethereum_history_api::receipt::{get_receipt, TxReceiptWithinBlock, PhantomReceiptProofLen, PhantomReceiptRlpLen};

global LOG_NUM = 1;
global MAX_LOG_DATA_LEN = 128; // 4 * 32 (Eth word len)
// MAX_RECEIPT_TRIE_NODE_LEN = Max(MAX_LEAF_LEN, MAX_BRANCH_LEN)
// Leafs can have arbitrary len and will be constrained by generics, but in normal case - branches are longer than leaves
// MAX_BRANCH_LEN = MAX_RLP_LIST_HEADER_LEN + 16 * MAX_RLP_ELEMENT_LEN + LEN_OF_NULL_ELEMENT
// MAX_RLP_LIST_HEADER_LEN = 1 + MAX_LEN_BYTES
// MAX_LEN_BYTES = 2
// MAX_RLP_LIST_HEADER_LEN = 3
// MAX_RLP_ELEMENT_LEN = 32
// LEN_OF_NULL_ELEMENT = 1
// MAX_BRANCH_LEN = 3 + 16 * 32 + 1 = 515
global MAX_RECEIPT_TRIE_NODE_LEN = 515;
global MAX_RECEIPT_PROOF_LEN = 3090; // MAX_RECEIPT_TRIE_NODE_LEN * MAX_RECEIPT_TREE_DEPTH
// TODO: Handle the case where receipt is longer than the branch node
global MAX_RECEIPT_RLP_LEN = 515; // == MAX_RECEIPT_TRIE_NODE_LEN 

fn main(
    block_number: pub Field,
    tx_idx: pub Field
) -> pub TxReceiptWithinBlock<LOG_NUM, MAX_LOG_DATA_LEN> {
    let max_receipt_proof_len: PhantomReceiptProofLen<MAX_RECEIPT_PROOF_LEN> = PhantomReceiptProofLen {};
    let max_receipt_rlp_length: PhantomReceiptRlpLen<MAX_RECEIPT_RLP_LEN> = PhantomReceiptRlpLen {};
    get_receipt(
        block_number,
        tx_idx,
        max_receipt_proof_len,
        max_receipt_rlp_length
    )
}

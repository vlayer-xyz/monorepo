use dep::ethereum_history_api::receipt::{get_receipt, TxReceiptWithinBlock, PhantomReceiptProofLen, PhantomReceiptRlpLen};

global LOG_NUM = 1;
global MAX_LOG_DATA_LEN = 128;

fn main(
    block_number: pub Field,
    tx_idx: pub Field
) -> pub TxReceiptWithinBlock<LOG_NUM, MAX_LOG_DATA_LEN> {
    let phantom_receipt_proof_len: PhantomReceiptProofLen <3724>  = PhantomReceiptProofLen {}; // = MAX_RECEIPT_TREE_DEPTH * MAX_TRIE_NODE_LENGTH
    let phantom_receipt_rlp_len: PhantomReceiptRlpLen <523>  = PhantomReceiptRlpLen {};

    get_receipt(
        block_number,
        tx_idx,
        phantom_receipt_proof_len,
        phantom_receipt_rlp_len
    )
}

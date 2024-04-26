use dep::ethereum_history_api::receipt::{get_receipt, TxReceiptWithinBlock, PhantomReceiptProofLen, PhantomReceiptRlpLen};

fn main(block_number: pub u64, tx_idx: pub Field) -> pub TxReceiptWithinBlock {
    let phantom_receipt_proof_len: PhantomReceiptProofLen <3724>  = PhantomReceiptProofLen {}; // = MAX_RECEIPT_TREE_DEPTH * MAX_TRIE_NODE_LENGTH
    let phantom_receipt_rlp_len: PhantomReceiptRlpLen <525>  = PhantomReceiptRlpLen {};

    get_receipt(
        block_number,
        tx_idx,
        phantom_receipt_proof_len,
        phantom_receipt_rlp_len
    )
}

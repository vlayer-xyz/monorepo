use dep::ethereum_history_api::receipt::{get_receipt, TxReceiptWithinBlock, FakeTurbofishReceiptProofLen, FakeTurbofishReceiptRlpLen};

global LOG_NUM = 1;
global MAX_LOG_DATA_SIZE = 128; // 4 * 32 (Eth word length)
global RECEIPT_PROOF_LENGTH = 3090; // MAX_TRIE_NODE_LENGTH * MAX_RECEIPT_TREE_DEPTH
global MAX_RECEIPT_RLP_LENGTH = 512; // TODO: Put the real value here

fn main(
    block_number: pub Field,
    tx_idx: pub Field
) -> pub TxReceiptWithinBlock<LOG_NUM, MAX_LOG_DATA_SIZE> {
    let max_receipt_proof_len: FakeTurbofishReceiptProofLen<RECEIPT_PROOF_LENGTH> = FakeTurbofishReceiptProofLen {};
    let max_receipt_rlp_length: FakeTurbofishReceiptRlpLen<MAX_RECEIPT_RLP_LENGTH> = FakeTurbofishReceiptRlpLen {};
    get_receipt(
        block_number,
        tx_idx,
        max_receipt_proof_len,
        max_receipt_rlp_length
    )
}

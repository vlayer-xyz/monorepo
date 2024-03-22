use dep::ethereum_history_api::receipt::{get_receipt, TxReceiptWithinBlock, TxReceiptProof};

global LOG_NUM = 1;
global MAX_LOG_DATA_LEN = 128;

fn main(
    block_number: pub Field,
    tx_idx: pub Field
) -> pub TxReceiptWithinBlock<LOG_NUM, MAX_LOG_DATA_LEN> {
    get_receipt(block_number, tx_idx)
}

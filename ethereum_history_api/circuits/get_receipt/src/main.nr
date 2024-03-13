use dep::ethereum_history_api::receipt::{get_receipt, TxReceiptWithinBlock};

global LOG_NUM = 1;
global MAX_LOG_DATA_SIZE = 128; // 4 * 32 (Eth word length)

fn main(block_number: pub Field, tx_idx: pub Field) -> pub TxReceiptWithinBlock<LOG_NUM, MAX_LOG_DATA_SIZE> {
    get_receipt(block_number, tx_idx)
}
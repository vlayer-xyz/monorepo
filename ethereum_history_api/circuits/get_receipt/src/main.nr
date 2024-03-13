use dep::ethereum_history_api::receipt::{get_receipt, TxReceiptWithinBlock};

global LOG_NUM = 1;

fn main(block_number: pub Field, tx_idx: pub Field) -> pub TxReceiptWithinBlock<LOG_NUM> {
    get_receipt(block_number, tx_idx)
}
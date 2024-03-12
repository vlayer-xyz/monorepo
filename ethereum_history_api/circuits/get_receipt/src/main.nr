use dep::ethereum_history_api::receipt::{get_tx_receipt, TxReceipt};

fn main(block_number: pub Field, tx_idx: pub Field) -> pub TxReceipt<1> {
    get_tx_receipt(block_number, tx_idx)
}
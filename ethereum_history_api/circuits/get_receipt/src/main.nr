use dep::ethereum_history_api::receipt::{get_receipt, TxReceiptWithinBlock, PhantomReceiptLeafLen, PhantomReceiptEncodedLen};

global MAX_ENCODED_LEN = 1000;
global MAX_LEAF_LEN = 1011;

fn main(chain_id: pub Field, block_number: pub u64, tx_idx: pub Field) -> pub TxReceiptWithinBlock {
    let phantom_receipt_encoded_len: PhantomReceiptEncodedLen <MAX_ENCODED_LEN>  = PhantomReceiptEncodedLen {};
    let phantom_receipt_leaf_len: PhantomReceiptLeafLen <MAX_LEAF_LEN>  = PhantomReceiptLeafLen {};

    get_receipt(
        chain_id,
        block_number,
        tx_idx,
        phantom_receipt_encoded_len,
        phantom_receipt_leaf_len
    )
}

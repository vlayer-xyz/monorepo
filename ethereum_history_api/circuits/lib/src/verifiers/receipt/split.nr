use dep::proof::{const::MAX_RECEIPT_RLP_LENGTH as MAX_ENCODED_RECEIPT_LENGTH, utils::memcpy};
use crate::receipt::TxType;

global MAX_RECEIPT_RLP_LENGTH: u64 = MAX_ENCODED_RECEIPT_LENGTH - 1;

pub(crate) fn split_receipt_into_tx_type_and_receipt_rlp(
    tx_type: TxType,
    encoded_receipt: [u8; MAX_ENCODED_RECEIPT_LENGTH]
) -> (u8, [u8; MAX_RECEIPT_RLP_LENGTH]) {
    if (tx_type == 0) {
        assert(
            encoded_receipt[MAX_ENCODED_RECEIPT_LENGTH - 1] == 0, "RLP receipt exceeds MAX_RECEIPT_RLP_LENGTH"
        );
        let mut receipt_rlp = [0; MAX_RECEIPT_RLP_LENGTH];
        memcpy(&mut receipt_rlp, encoded_receipt, 0);
        (tx_type, receipt_rlp)
    } else {
        let mut receipt_rlp = [0; MAX_RECEIPT_RLP_LENGTH];
        memcpy(&mut receipt_rlp, encoded_receipt, 1);
        (encoded_receipt[0], receipt_rlp)
    }
}

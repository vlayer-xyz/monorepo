use crate::misc::arrays::memcpy;
use crate::receipt::TxType;
use crate::verifiers::receipt::{MAX_ENCODED_RECEIPT_LENGTH, MAX_RECEIPT_RLP_LENGTH};

pub(crate) fn split_into_tx_type_and_rlp<MAX_ENCODED_LENGTH, MAX_RLP_LENGTH>(
    tx_type: TxType,
    encoded_receipt: [u8; MAX_ENCODED_LENGTH]
) -> (u8, [u8; MAX_RLP_LENGTH]) {
    if (tx_type == 0) {
        assert(encoded_receipt[MAX_ENCODED_LENGTH - 1] == 0, "RLP receipt exceeds MAX_RLP_LENGTH");
        let mut receipt_rlp = [0; MAX_RLP_LENGTH];
        memcpy(&mut receipt_rlp, encoded_receipt, 0);
        (tx_type, receipt_rlp)
    } else {
        let mut receipt_rlp = [0; MAX_RLP_LENGTH];
        memcpy(&mut receipt_rlp, encoded_receipt, 1);
        (encoded_receipt[0], receipt_rlp)
    }
}

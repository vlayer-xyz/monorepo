use crate::misc::fragment::Fragment;
use crate::receipt::TxType;
use crate::verifiers::receipt::{MAX_ENCODED_RECEIPT_LENGTH, MAX_RECEIPT_RLP_LENGTH};

pub(crate) fn split_into_tx_type_and_rlp<MAX_ENCODED_LEN>(
    is_legacy: bool,
    encoded: Fragment<MAX_ENCODED_LEN, u8>
) -> (u8, Fragment<MAX_ENCODED_LEN, u8>) {
    let mut rlp = encoded;
    if is_legacy {
        assert(rlp.pop_back() == 0, "RLP receipt exceeds MAX_RLP_LENGTH");
        (0, rlp)
    } else {
        let tx_type = rlp.pop_front();
        (tx_type, rlp)
    }
}

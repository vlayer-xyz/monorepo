use crate::misc::arrays::memcpy;
use crate::receipt::TxType;
use crate::verifiers::receipt::{MAX_ENCODED_RECEIPT_LENGTH, MAX_RECEIPT_RLP_LENGTH};

pub(crate) fn split_into_tx_type_and_rlp<MAX_ENCODED_LENGTH, MAX_RLP_LENGTH>(is_legacy: bool, encoded: [u8; MAX_ENCODED_LENGTH]) -> (u8, [u8; MAX_RLP_LENGTH]) {
    if is_legacy {
        assert(encoded[MAX_ENCODED_LENGTH - 1] == 0, "RLP receipt exceeds MAX_RLP_LENGTH");
        let mut rlp = [0; MAX_RLP_LENGTH];
        memcpy(&mut rlp, encoded, 0);
        (0, rlp)
    } else {
        let mut rlp = [0; MAX_RLP_LENGTH];
        memcpy(&mut rlp, encoded, 1);
        (encoded[0], rlp)
    }
}

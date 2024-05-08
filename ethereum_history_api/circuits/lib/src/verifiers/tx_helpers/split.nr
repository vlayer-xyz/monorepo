use crate::misc::arrays::memcpy;
use crate::receipt::TxType;

pub(crate) fn split_into_tx_type_and_rlp<MAX_ENCODED_LEN, MAX_RLP_LEN>(is_legacy: bool, encoded: [u8; MAX_ENCODED_LEN]) -> (u8, [u8; MAX_RLP_LEN]) {
    if is_legacy {
        assert(encoded[MAX_ENCODED_LEN - 1] == 0, "RLP receipt exceeds MAX_RLP_LENGTH");
        let mut rlp = [0; MAX_RLP_LEN];
        memcpy(&mut rlp, encoded, 0);
        (0, rlp)
    } else {
        let mut rlp = [0; MAX_RLP_LEN];
        memcpy(&mut rlp, encoded, 1);
        (encoded[0], rlp)
    }
}

mod receipt {
    use crate::misc::arrays::{sub_array_equals, memcpy};
    use crate::verifiers::tx_helpers::split::split_into_tx_type_and_rlp;

    use crate::fixtures::mainnet::{
        cancun::small_block::{receipt::{encoded_receipt, tx_type}},
        homestead::fork::{receipt::{encoded_receipt as pre_byzantium_encoded_receipt, tx_type as legacy_tx_type}}
    };
    use crate::receipt::TxType;

    // TODO: Change to M size after changing fixtures.
    global MAX_ENCODED_LEN = 525;
    global MAX_RLP_LEN = MAX_ENCODED_LEN - 1;

    #[test]
    fn eip1559() {
        let (tx_type, receipt_rlp): (TxType, [u8; MAX_RLP_LEN]) = split_into_tx_type_and_rlp(false, encoded_receipt);
        assert(tx_type == encoded_receipt[0], "Incorrect tx type returned");
        assert(receipt_rlp.len() == encoded_receipt.len() - 1, "Incorrect receipt RLP length returned");
        assert(sub_array_equals(receipt_rlp, encoded_receipt, 1), "Incorrect receipt RLP returned");
    }

    #[test]
    fn legacy() {
        let (tx_type, receipt_rlp): (TxType, [u8; MAX_RLP_LEN]) = split_into_tx_type_and_rlp(true, pre_byzantium_encoded_receipt);
        assert(tx_type == legacy_tx_type, "Incorrect tx type returned");
        assert(receipt_rlp.len() == encoded_receipt.len() - 1, "Incorrect receipt RLP length returned");
        assert(
            sub_array_equals(receipt_rlp, pre_byzantium_encoded_receipt, 0), "Incorrect receipt RLP returned"
        );
    }

    #[test(should_fail_with="RLP receipt exceeds MAX_RLP_LENGTH")]
    fn legacy_wrong_rlp() {
        let mut wrong_legacy_rlp = [0; MAX_ENCODED_LEN];
        memcpy(&mut wrong_legacy_rlp, pre_byzantium_encoded_receipt, 0);

        let not_zero_byte = 0x01;
        wrong_legacy_rlp[MAX_ENCODED_LEN - 1] = not_zero_byte;

        let (_, _): (TxType, [u8; MAX_RLP_LEN]) = split_into_tx_type_and_rlp(true, wrong_legacy_rlp);
    }
}

mod transaction {
    use crate::misc::arrays::{sub_array_equals, memcpy};
    use crate::verifiers::tx_helpers::split::split_into_tx_type_and_rlp;

    use crate::fixtures::mainnet::{
        cancun::small_block::{transaction::{encoded_tx, tx_type}},
        homestead::fork::{transaction::{encoded_tx as pre_byzantium_encoded_tx, tx_type as legacy_tx_type}}
    };
    use crate::verifiers::transaction::{MAX_ENCODED_TX_LENGTH, MAX_TX_RLP_LENGTH};
    use crate::transaction::TxType;

    #[test]
    fn eip1559() {
        let (tx_type, tx_rlp): (TxType, [u8; MAX_TX_RLP_LENGTH]) = split_into_tx_type_and_rlp(false, encoded_tx);
        assert(tx_type == encoded_tx[0], "Incorrect tx type returned");
        assert(tx_rlp.len() == encoded_tx.len() - 1, "Incorrect tx RLP length returned");
        assert(sub_array_equals(tx_rlp, encoded_tx, 1), "Incorrect tx RLP returned");
    }

    #[test]
    fn legacy() {
        let (tx_type, tx_rlp): (TxType, [u8; MAX_TX_RLP_LENGTH]) = split_into_tx_type_and_rlp(true, pre_byzantium_encoded_tx);
        assert(tx_type == legacy_tx_type, "Incorrect tx type returned");
        assert(tx_rlp.len() == encoded_tx.len() - 1, "Incorrect receipt RLP length returned");
        assert(sub_array_equals(tx_rlp, pre_byzantium_encoded_tx, 0), "Incorrect receipt RLP returned");
    }

    #[test(should_fail_with="RLP receipt exceeds MAX_RLP_LENGTH")]
    fn legacy_wrong_rlp() {
        let mut wrong_legacy_rlp = [0; MAX_ENCODED_TX_LENGTH];
        memcpy(&mut wrong_legacy_rlp, pre_byzantium_encoded_tx, 0);

        let not_zero_byte = 0x01;
        wrong_legacy_rlp[MAX_ENCODED_TX_LENGTH - 1] = not_zero_byte;

        let (_, _): (TxType, [u8; MAX_TX_RLP_LENGTH]) = split_into_tx_type_and_rlp(true, wrong_legacy_rlp);
    }
}

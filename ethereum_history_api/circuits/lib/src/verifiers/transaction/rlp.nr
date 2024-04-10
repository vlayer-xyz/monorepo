use crate::{verifiers::transaction::MAX_TX_RLP_LENGTH, transaction::{TxType, TxPartial}};
use crate::rlp::decode::{RlpList, decode_list};
use crate::misc::{types::{PaddedValue, ADDRESS_LENGTH, U128_LENGTH}, bytes::byte_value};
use dep::u2b::u64_to_u8;
use dep::proof::const::HASH_LENGTH;

global MAX_TX_FIELDS_COUNT = 14;

pub(crate) fn assert_tx_rlp_equals<MAX_DATA_LEN>(
    tx_rlp: [u8; MAX_TX_RLP_LENGTH],
    tx_type: TxType,
    tx: TxPartial<MAX_DATA_LEN>
) {
    let tx_rlp_list: RlpList<MAX_TX_FIELDS_COUNT> = decode_list(tx_rlp);
    let fields_count = [9, 11, 12, 14][tx_type];
    assert(tx_rlp_list.num_fields == fields_count, "Invalid number of fields in tx RLP");

    let nonce = u64_to_u8(tx.nonce);
    let nonce_idx = [0, 1, 1, 1][tx_type];
    tx_rlp_list.fragments[nonce_idx].assert_string_eq("Nonce", tx_rlp, Into::into(byte_value(nonce)));

    let gas_limit = u64_to_u8(tx.gas_limit);
    let gas_limit_idx = [2, 3, 4, 4][tx_type];
    tx_rlp_list.fragments[gas_limit_idx].assert_string_eq("Gas limit", tx_rlp, Into::into(byte_value(gas_limit)));

    let to_idx = [3, 4, 5, 5][tx_type];
    if (tx.to.is_some()) {
        tx_rlp_list.fragments[to_idx].assert_string_eq(
            "To",
            tx_rlp,
            Into::into((tx.to.expect(f"to is missing"), ADDRESS_LENGTH))
        );
    } else {
        tx_rlp_list.fragments[to_idx].assert_string_eq("To", tx_rlp, PaddedValue::zero());
    }

    tx_rlp_list.fragments[to_idx + 1].assert_string_eq(
        "Value",
        tx_rlp,
        Into::into(byte_value(tx.value.to_be_bytes()))
    );

    tx_rlp_list.fragments[to_idx + 2].assert_string_eq("Data", tx_rlp, tx.data);

    let signature_idx = [6, 8, 9, 11][tx_type];
    tx_rlp_list.fragments[signature_idx].assert_string_eq("V", tx_rlp, Into::into(byte_value([tx.v as u8])));
    tx_rlp_list.fragments[signature_idx + 1].assert_string_eq("R", tx_rlp, Into::into((tx.r, HASH_LENGTH)));
    tx_rlp_list.fragments[signature_idx + 2].assert_string_eq("S", tx_rlp, Into::into((tx.s, HASH_LENGTH)));
}

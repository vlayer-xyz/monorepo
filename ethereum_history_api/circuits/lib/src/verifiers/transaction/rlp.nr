use crate::{verifiers::transaction::MAX_TX_RLP_LENGTH, transaction::{TxType, TxPartial}};
use crate::rlp::decode::decode_list;
use crate::rlp::list::RlpList;
use crate::misc::{types::{ADDRESS_LENGTH, U128_LENGTH}, bytes::byte_value};
use dep::u2b::u64_to_u8;
use dep::proof::const::HASH_LENGTH;

struct FieldLayout {
    field_count: u64,
    nonce_idx: u8,
    gas_limit_idx: u8,
    to_idx: u8,
    signature_idx: u8,
}

global TX_TYPE_TO_FIELD_LAYOUT = [
    FieldLayout {field_count: 9, nonce_idx: 0, gas_limit_idx: 2, to_idx: 3, signature_idx: 6},
    FieldLayout {field_count: 11, nonce_idx: 1, gas_limit_idx: 3, to_idx: 4, signature_idx: 8},
    FieldLayout {field_count: 12, nonce_idx: 1, gas_limit_idx: 4, to_idx: 5, signature_idx: 9},
    FieldLayout {field_count: 14, nonce_idx: 1, gas_limit_idx: 4, to_idx: 5, signature_idx: 11},
];

global MAX_TX_FIELDS_COUNT = 14;

pub(crate) fn assert_tx_rlp_equals<MAX_DATA_LEN>(
    tx_rlp: [u8; MAX_TX_RLP_LENGTH],
    tx_type: TxType,
    tx: TxPartial<MAX_DATA_LEN>
) {
    let rlp_list: RlpList<MAX_TX_RLP_LENGTH, MAX_TX_FIELDS_COUNT> = decode_list(tx_rlp);
    let num_fields = rlp_list.len();
    let fragments = rlp_list.storage();

    let FieldLayout {field_count, nonce_idx, gas_limit_idx, to_idx, signature_idx} = TX_TYPE_TO_FIELD_LAYOUT[tx_type];
    assert(num_fields == field_count, "Invalid number of fields in tx RLP");

    let nonce = u64_to_u8(tx.nonce);
    fragments[nonce_idx].assert_string_eq("Nonce", tx_rlp, byte_value(nonce));

    let gas_limit = u64_to_u8(tx.gas_limit);
    fragments[gas_limit_idx].assert_string_eq("Gas limit", tx_rlp, byte_value(gas_limit));

    if (tx.to.is_some()) {
        fragments[to_idx].assert_string_eq(
            "To",
            tx_rlp,
            BoundedVec { storage: tx.to.expect(f"to is missing"), len: ADDRESS_LENGTH }
        );
    } else {
        let zero: BoundedVec<u8, 0> = BoundedVec::new();
        fragments[to_idx].assert_string_eq("To", tx_rlp, zero);
    }

    fragments[to_idx + 1].assert_string_eq(
        "Value",
        tx_rlp,
        Into::into(byte_value(tx.value.to_be_bytes()))
    );

    fragments[to_idx + 2].assert_string_eq("Data", tx_rlp, tx.data);

    fragments[signature_idx].assert_string_eq("V", tx_rlp, byte_value([tx.v as u8]));
    fragments[signature_idx + 1].assert_string_eq("R", tx_rlp, BoundedVec { storage: tx.r, len: HASH_LENGTH });
    fragments[signature_idx + 2].assert_string_eq("S", tx_rlp, BoundedVec { storage: tx.s, len: HASH_LENGTH });
}

use dep::proof::{const::HASH_LENGTH, trie_proof::TrieProof, rlp::decode0};
use dep::u2b::u64_to_u8;

use crate::transaction::{TransactionProof, Transaction, TxType};
use crate::misc::{arrays::sub_array_equals_up_to_length, bytes::{nibbles_to_bytes, bytes_to_field, left_nibble_shift}};

global KEY_LEN = 6;

global BERLIN_BLOCK_NUM: u64 = 12_244_000;
global LONDON_BLOCK_NUM: u64 = 12_965_000;
global CANCUN_BLOCK_NUM: u64 = 19_426_587;

pub(crate) fn get_transaction_fields_count(block_number: u64) -> u64 {
    let mut fields_count = 9;
    if block_number >= BERLIN_BLOCK_NUM {
        fields_count += 2;
    }
    if block_number >= LONDON_BLOCK_NUM {
        fields_count += 2;
    }
    if block_number >= CANCUN_BLOCK_NUM {
        fields_count += 2;
    }

    fields_count
}

pub(crate) fn assert_tx_type(
    tx_type: TxType,
    enco: [u8; MAX_RECEIPT_RLP_LENGTH]
) -> [u8; MAX_RECEIPT_RLP_LENGTH] {
    if (tx_type == 0) {
        encoded_receipt
    } else {
        assert(encoded_receipt[0] == tx_type, "Invalid tx type");
        let mut receipt_rlp = [0; MAX_RECEIPT_RLP_LENGTH];
        memcpy(&mut receipt_rlp, encoded_receipt, 1);
        receipt_rlp
    }
}

pub(crate) fn assert_transaction_equals<MAX_TRANSACTION_DATA_LEN>(
    block_number: Field,
    tx_type: TxType,
    encoded_transaction: [u8; MAX_TRANSACTION_RLP_LEN],
    transaction: Transaction<MAX_TRANSACTION_DATA_LEN>
) {
    let transaction_rlp_right_padded = assert_tx_type(tx_type, encoded_transaction);
    let rlp_list: RLP_List<MAX_HEADER_FIELDS_COUNT> = decode1(block_header_rlp.data);
    let expected_header_fields_count = get_header_fields_count(chain_id, block_header_partial.number as u64);

    assert(
        expected_header_fields_count == rlp_list.num_fields, "number of header RLP fields does not match"
    );
    assert(false, "Not implemented");
}

pub fn assert_tx_idx_equals(key: [u8; KEY_LEN], tx_idx: Field) {
    assert(false, "Not implemented");
}

fn assert_transaction_proof<MAX_TRANSACTION_PROOF_LEN, MAX_TRANSACTION_RLP_LEN>(
    proof: TransactionProof,
    root: [u8; HASH_LENGTH]
) {
    assert(false, "Not implemented");
}

pub fn verify_transaction<MAX_TRANSACTION_DATA_LEN, MAX_TRANSACTION_PROOF_LEN, MAX_TRANSACTION_RLP_LEN>(
    block_number: Field,
    tx_idx: Field,
    transaction: Transaction<MAX_TRANSACTION_DATA_LEN>,
    transaction_proof: TransactionProof,
    transaction_root: [u8; HASH_LENGTH]
) {
    assert(false, "Not implemented");
}


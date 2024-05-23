mod rlp;
mod rlp_test;

use dep::proof::{transaction_proof::TransactionProof, node::key_as_nibbles, const::HASH_LENGTH};

use crate::transaction::{TxPartial, TxType};
use crate::verifiers::{
    transaction::rlp::assert_tx_rlp_equals,
    tx_helpers::{idx::assert_tx_idx_equals, split::split_into_tx_type_and_rlp}
};
use crate::misc::{bytes::right_pad, fragment::Fragment};

global MAX_ENCODED_TX_LENGTH: u64 = 525;
global MAX_TX_RLP_LENGTH: u64 = MAX_ENCODED_TX_LENGTH - 1;

pub(crate) fn assert_tx_proof<MAX_PROOF_LEN, MAX_RLP_LEN>(
    proof: TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN>,
    root: [u8; HASH_LENGTH]
) {
    assert(proof.verify_transaction_root(root), "TrieProof: Invalid tx root");
}

pub(crate) fn assert_tx_equals<MAX_DATA_LEN, MAX_ENCODED_LEN>(
    tx_type: TxType,
    encoded_tx: Fragment<MAX_ENCODED_LEN, u8>,
    tx: TxPartial<MAX_DATA_LEN>
) {
    let is_legacy = tx_type == 0;
    let (actual_tx_type, tx_rlp) = split_into_tx_type_and_rlp(is_legacy, encoded_tx);

    assert(actual_tx_type == tx_type, "Invalid tx type");
    assert_tx_rlp_equals(tx_rlp, tx_type, tx);
}

pub fn verify_tx<MAX_DATA_LEN, MAX_PROOF_LEN, MAX_ENCODED_TX_LEN>(
    tx_idx: Field,
    tx_type: TxType,
    tx: TxPartial<MAX_DATA_LEN>,
    tx_proof: TransactionProof<MAX_PROOF_LEN, MAX_ENCODED_TX_LEN>,
    tx_root: [u8; HASH_LENGTH]
) {
    let key = Fragment::from_vec(right_pad(tx_proof.key));
    assert_tx_idx_equals(key, tx_idx);

    let value = right_pad(tx_proof.value).storage;
    assert_tx_equals(tx_type, Fragment::from_array(value), tx);
    assert_tx_proof(tx_proof, tx_root);
}
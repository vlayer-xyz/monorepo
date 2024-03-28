use crate::misc::types::{Bytes32, Address};
use dep::std::unsafe::zeroed;

global MAX_TREE_DEPTH = 7;
global MAX_KEY_LEN = 3;

struct Transaction<MAX_DATA_LEN> {
    nonce: Field,
    gas_price: Option<Field>,
    gas_limit: Field,
    to: Option<Address>,
    value: Field,
    data: [u8; MAX_DATA_LEN],
    data_len: Field,
    v: Field,  // ECDSA recovery id
    r: Bytes32,  // ECDSA signature part
    s: Bytes32,  // ECDSA signature part
}

struct PhantomTransactionProofLen<MAX_PROOF_LEN> {}
struct PhantomTransactionRlpLen<MAX_RLP_LEN> {}

struct TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN> {
    key: [u8; MAX_KEY_LEN],
    value: [u8; MAX_RLP_LEN],
    proof: [u8; MAX_PROOF_LEN],
    depth: u64
}

struct TransactionWithinBlock<MAX_DATA_LEN> {
    transaction: Transaction<MAX_DATA_LEN>,
    block_hash: Bytes32
}

pub fn get_transaction<MAX_DATA_LEN, MAX_PROOF_LEN, MAX_RLP_LEN>(
    _block_number: Field,
    _tx_idx: Field,
    _max_transaction_proof_len: PhantomTransactionProofLen<MAX_PROOF_LEN>,
    _max_transaction_rlp_len: PhantomTransactionRlpLen<MAX_RLP_LEN>
) -> TransactionWithinBlock<MAX_DATA_LEN> {
    let _ = get_transaction_unconstrained(
        _block_number,
        _tx_idx,
        _max_transaction_proof_len,
        _max_transaction_rlp_len
    );
    assert(false, "Not implemented");
    zeroed()
}

#[oracle(get_transaction)]
unconstrained fn get_transaction_oracle<MAX_DATA_LEN, MAX_PROOF_LEN, MAX_RLP_LEN>(
    _block_number: Field,
    _tx_idx: Field,
    _max_transaction_proof_len: PhantomTransactionProofLen<MAX_PROOF_LEN>,
    _max_transaction_rlp_len: PhantomTransactionRlpLen<MAX_RLP_LEN>
) -> (Transaction<MAX_DATA_LEN>, TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN>) {}

unconstrained fn get_transaction_unconstrained<MAX_DATA_LEN, MAX_PROOF_LEN, MAX_RLP_LEN>(
    block_number: Field,
    tx_idx: Field,
    max_transaction_proof_len: PhantomTransactionProofLen<MAX_PROOF_LEN>,
    max_transaction_rlp_len: PhantomTransactionRlpLen<MAX_RLP_LEN>
) -> (Transaction<MAX_DATA_LEN>, TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN>) {
    get_transaction_oracle(
        block_number,
        tx_idx,
        max_transaction_proof_len,
        max_transaction_rlp_len
    )
}

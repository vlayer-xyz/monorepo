use crate::misc::types::{Bytes32, Address};
use dep::std::unsafe::zeroed;

global MAX_TRANSACTION_TREE_DEPTH = 6;

struct Transaction<MAX_TRANSACTION_DATA_SIZE> {
    nonce: Bytes32,
    gas_price: Bytes32,
    gas_limit: Bytes32,
    to: Address,
    value: Bytes32,
    data: [u8; MAX_TRANSACTION_DATA_SIZE],
    data_len: Field,
    v: Bytes32,  // ECDSA recovery id
    r: Bytes32,  // ECDSA signature part
    s: Bytes32,  // ECDSA signature part
}

struct PhantomTransactionProofLen<MAX_TRANSACTION_PROOF_LENGTH> {}
struct PhantomTransactionRlpLen<MAX_TRANSACTION_RLP_LENGTH> {}

struct TransactionProof<MAX_TRANSACTION_PROOF_LENGTH, MAX_TRANSACTION_RLP_LENGTH> {
    key: [u8; MAX_TRANSACTION_TREE_DEPTH],
    value: [u8; MAX_TRANSACTION_RLP_LENGTH],
    proof: [u8; MAX_TRANSACTION_PROOF_LENGTH],
    depth: u64
}

struct TransactionWithinBlock<MAX_TRANSACTION_DATA_SIZE> {
    transation: Transaction<MAX_TRANSACTION_DATA_SIZE>,
    block_hash: Bytes32
}

pub fn get_transaction<MAX_TRANSACTION_DATA_SIZE, MAX_TRANSACTION_PROOF_LENGTH, MAX_TRANSACTION_RLP_LENGTH>(
    _block_number: Field,
    _tx_idx: Field,
    _max_transaction_proof_len: PhantomTransactionProofLen<MAX_TRANSACTION_PROOF_LENGTH>,
    _max_transaction_rlp_len: PhantomTransactionRlpLen<MAX_TRANSACTION_RLP_LENGTH>
) -> TransactionWithinBlock<MAX_TRANSACTION_DATA_SIZE> {
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
unconstrained fn get_transaction_oracle<MAX_TRANSACTION_DATA_SIZE, MAX_TRANSACTION_PROOF_LENGTH, MAX_TRANSACTION_RLP_LENGTH>(
    _block_number: Field,
    _tx_idx: Field,
    _max_transaction_proof_len: PhantomTransactionProofLen<MAX_TRANSACTION_PROOF_LENGTH>,
    _max_transaction_rlp_len: PhantomTransactionRlpLen<MAX_TRANSACTION_RLP_LENGTH>
) -> (Transaction<MAX_TRANSACTION_DATA_SIZE>, TransactionProof<MAX_TRANSACTION_PROOF_LENGTH, MAX_TRANSACTION_RLP_LENGTH>) {}

unconstrained fn get_transaction_unconstrained<MAX_TRANSACTION_DATA_SIZE, MAX_TRANSACTION_PROOF_LENGTH, MAX_TRANSACTION_RLP_LENGTH>(
    block_number: Field,
    tx_idx: Field,
    max_transaction_proof_len: PhantomTransactionProofLen<MAX_TRANSACTION_PROOF_LENGTH>,
    max_transaction_rlp_len: PhantomTransactionRlpLen<MAX_TRANSACTION_RLP_LENGTH>
) -> (Transaction<MAX_TRANSACTION_DATA_SIZE>, TransactionProof<MAX_TRANSACTION_PROOF_LENGTH, MAX_TRANSACTION_RLP_LENGTH>) {
    get_transaction_oracle(
        block_number,
        tx_idx,
        max_transaction_proof_len,
        max_transaction_rlp_len
    )
}

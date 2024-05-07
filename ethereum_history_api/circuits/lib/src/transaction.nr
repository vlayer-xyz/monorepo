use crate::misc::{types::{Bytes32, Address}, option::make_option};
use dep::std::unsafe::zeroed;
use dep::proof::transaction_proof::TransactionProof;

global MAX_TREE_DEPTH = 7;
global MAX_KEY_LEN = 3;

type TxType = u8;

struct TxPartial<MAX_DATA_LEN> {
    nonce: u64,
    gas_limit: u64,
    to: Option<Address>,
    value: U128,
    data: BoundedVec<u8, MAX_DATA_LEN>,
    v: u8,  // ECDSA recovery id
    r: Bytes32,  // ECDSA signature part
    s: Bytes32,  // ECDSA signature part
}

struct ForeignCallTransaction<MAX_DATA_LEN> {
    nonce: u64,
    gas_limit: u64,
    to: Address,
    to_is_some: bool,
    value: Field,
    data: [u8; MAX_DATA_LEN],
    data_len: u64,
    v: u8,  // ECDSA recovery id
    r: Bytes32,  // ECDSA signature part
    s: Bytes32,  // ECDSA signature part
}

struct PhantomTransactionProofLen<MAX_PROOF_LEN> {}
struct PhantomTransactionRlpLen<MAX_RLP_LEN> {}

struct TransactionWithinBlock<MAX_DATA_LEN> {
    transaction: TxPartial<MAX_DATA_LEN>,
    block_hash: Bytes32
}

pub fn get_transaction<MAX_DATA_LEN, MAX_PROOF_LEN, MAX_RLP_LEN>(
    _chain_id: Field,
    _block_number: Field,
    _tx_idx: Field,
    _max_transaction_proof_len: PhantomTransactionProofLen<MAX_PROOF_LEN>,
    _max_transaction_rlp_len: PhantomTransactionRlpLen<MAX_RLP_LEN>
) -> TransactionWithinBlock<MAX_DATA_LEN> {
    let _ = get_transaction_unconstrained(
        _chain_id,
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
    _chain_id: Field,
    _block_number: Field,
    _tx_idx: Field,
    _max_transaction_proof_len: PhantomTransactionProofLen<MAX_PROOF_LEN>,
    _max_transaction_rlp_len: PhantomTransactionRlpLen<MAX_RLP_LEN>
) -> (TxType, ForeignCallTransaction<MAX_DATA_LEN>, TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN>) {}

unconstrained fn get_transaction_unconstrained<MAX_DATA_LEN, MAX_PROOF_LEN, MAX_RLP_LEN>(
    chain_id: Field,
    block_number: Field,
    tx_idx: Field,
    max_transaction_proof_len: PhantomTransactionProofLen<MAX_PROOF_LEN>,
    max_transaction_rlp_len: PhantomTransactionRlpLen<MAX_RLP_LEN>
) -> (TxType, TxPartial<MAX_DATA_LEN>, TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN>) {
    let (tx_type, transaction, proof) = get_transaction_oracle(
        chain_id,
        block_number,
        tx_idx,
        max_transaction_proof_len,
        max_transaction_rlp_len
    );

    let transaction = TxPartial {
        nonce: transaction.nonce,
        gas_limit: transaction.gas_limit,
        to: make_option(transaction.to, transaction.to_is_some),
        value: U128::from_integer(transaction.value),
        data: BoundedVec { storage: transaction.data, len: transaction.data_len },
        v: transaction.v,
        r: transaction.r,
        s: transaction.s
    };
    (tx_type, transaction, proof)
}

use crate::misc::{types::{Bytes32, Address}, option::make_option};
use dep::std::unsafe::zeroed;
use dep::proof::transaction_proof::TransactionProof;
use crate::header::get_header;
use crate::verifiers::transaction::verify_tx;

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

impl<MAX_DATA_LEN> Eq for TxPartial<MAX_DATA_LEN> {
    fn eq(self, other: Self) -> bool {
        (self.nonce == other.nonce) &
        (self.gas_limit == other.gas_limit) &
        (self.to == other.to) &
        (self.value == other.value) &
        (self.data == other.data) &
        (self.v == other.v) &
        (self.r == other.r) &
        (self.s == other.s)
    }
}

struct ForeignCallTransaction<MAX_DATA_LEN> {
    nonce: u64,
    gas_limit: u64,
    to: Address,
    to_is_some: bool,
    value_hi: u64,
    value_lo: u64,
    data: [u8; MAX_DATA_LEN],
    data_len: u64,
    v: u8,  // ECDSA recovery id
    r: Bytes32,  // ECDSA signature part
    s: Bytes32,  // ECDSA signature part
}

impl<MAX_DATA_LEN> From<TxPartial> for ForeignCallTransaction<MAX_DATA_LEN> {
    fn from(tx: TxPartial<MAX_DATA_LEN>) -> Self {
        let mut data = [0; MAX_DATA_LEN];

        // For some unclear reason (https://github.com/noir-lang/noir/issues/5011) - dynamic loop also works here, but we refrain from using it out of abundance of caution
        for i in 0..MAX_DATA_LEN {
            if (i < tx.data.len) {
                data[i] = tx.data.storage[i];
            }
        }
        ForeignCallTransaction {
            nonce: tx.nonce,
            gas_limit: tx.gas_limit,
            to: tx.to.unwrap_or(zeroed()),
            to_is_some: tx.to.is_some(),
            value_hi: tx.value.hi as u64,
            value_lo: tx.value.lo as u64,
            data,
            data_len: tx.data.len,
            v: tx.v,
            r: tx.r,
            s: tx.s
        }
    }
}

impl<MAX_DATA_LEN> From<ForeignCallTransaction> for TxPartial<MAX_DATA_LEN> {
    fn from(tx: ForeignCallTransaction<MAX_DATA_LEN>) -> Self {
        let data = BoundedVec { storage: tx.data, len: tx.data_len };
        TxPartial {
            nonce: tx.nonce,
            gas_limit: tx.gas_limit,
            to: make_option(tx.to, tx.to_is_some),
            value: U128::from_u64s_be(tx.value_hi, tx.value_lo),
            data,
            v: tx.v,
            r: tx.r,
            s: tx.s
        }
    }
}

struct PhantomTransactionProofLen<MAX_PROOF_LEN> {}
struct PhantomTransactionRlpLen<MAX_RLP_LEN> {}

struct TransactionWithinBlock<MAX_DATA_LEN> {
    transaction: TxPartial<MAX_DATA_LEN>,
    block_hash: Bytes32
}

pub fn get_transaction<MAX_DATA_LEN, MAX_PROOF_LEN, MAX_RLP_LEN>(
    chain_id: Field,
    block_number: u64,
    tx_idx: Field,
    _max_transaction_proof_len: PhantomTransactionProofLen<MAX_PROOF_LEN>,
    _max_transaction_rlp_len: PhantomTransactionRlpLen<MAX_RLP_LEN>
) -> TransactionWithinBlock<MAX_DATA_LEN> {
    let (tx_type, transaction, proof):  (TxType, TxPartial<MAX_DATA_LEN>, TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN>) = get_transaction_unconstrained(chain_id, block_number, tx_idx);
    let header = get_header(chain_id, block_number);
    verify_tx(tx_idx, tx_type, transaction, proof, header.transactions_root);

    TransactionWithinBlock { transaction, block_hash: header.hash }
}

#[oracle(get_transaction)]
unconstrained fn get_transaction_oracle<MAX_DATA_LEN, MAX_PROOF_LEN, MAX_RLP_LEN>(
    _chain_id: Field,
    _block_number: u64,
    _tx_idx: Field
) -> (TxType, ForeignCallTransaction<MAX_DATA_LEN>, TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN>) {}

unconstrained fn get_transaction_unconstrained<MAX_DATA_LEN, MAX_PROOF_LEN, MAX_RLP_LEN>(
    chain_id: Field,
    block_number: u64,
    tx_idx: Field
) -> (TxType, TxPartial<MAX_DATA_LEN>, TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN>) {
    let (tx_type, transaction, proof): (TxType, ForeignCallTransaction<MAX_DATA_LEN>, TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN>) = get_transaction_oracle(chain_id, block_number, tx_idx);
    let transaction: TxPartial<MAX_DATA_LEN> = transaction.into();
    (tx_type, transaction, proof)
}

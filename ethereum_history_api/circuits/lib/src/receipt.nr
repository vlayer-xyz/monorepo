use crate::misc::{types::{Bytes32, Address}, option::make_option};
use crate::header::get_header;
use crate::verifiers::receipt::{MAX_ENCODED_RECEIPT_LENGTH, verify_receipt};
use dep::std::unsafe::zeroed;
use dep::proof::receipt_proof::ReceiptProof;

global BLOOM_FILTER_LEN: u64 = 256;
global MAX_RECEIPT_KEY_LEN = 3;
global MAX_RECEIPT_TREE_DEPTH = 7;

struct Log<MAX_LOG_DATA_LEN> {
    address: Address,
    topics: [Bytes32; 4],
    data: [u8; MAX_LOG_DATA_LEN]
}

type TxType = u8;

struct PhantomReceiptProofLen<MAX_RECEIPT_PROOF_LEN> {}
struct PhantomReceiptRlpLen<MAX_RECEIPT_ENCODED_LEN> {}

struct TxReceiptPartial {
    status: Option<u1>,
    state_root: Option<Bytes32>,
    cumulative_gas_used: u32,
    logs_bloom: [u8; BLOOM_FILTER_LEN]
}

impl Eq for TxReceiptPartial {
    fn eq(self, other: Self) -> bool {
        (self.status == other.status) &
        (self.state_root == other.state_root) &
        (self.cumulative_gas_used == other.cumulative_gas_used) &
        (self.logs_bloom == other.logs_bloom)
    }

}

struct ForeignCallTxReceiptPartial {
    status: u1,
    status_is_some: bool,
    state_root: Bytes32,
    state_root_is_some: bool,
    cumulative_gas_used: u32,
    logs_bloom: [u8; BLOOM_FILTER_LEN]
}

impl From<ForeignCallTxReceiptPartial> for TxReceiptPartial {
    fn from(receipt: ForeignCallTxReceiptPartial) -> Self {
        TxReceiptPartial {
            status: make_option(receipt.status, receipt.status_is_some),
            state_root: make_option(receipt.state_root, receipt.state_root_is_some),
            cumulative_gas_used: receipt.cumulative_gas_used,
            logs_bloom: receipt.logs_bloom
        }
    }
}

impl From<TxReceiptPartial> for ForeignCallTxReceiptPartial {
    fn from(receipt: TxReceiptPartial) -> Self {
        ForeignCallTxReceiptPartial {
            status: receipt.status.unwrap_or(zeroed()),
            status_is_some: receipt.status.is_some(),
            state_root: receipt.state_root.unwrap_or(zeroed()),
            state_root_is_some: receipt.state_root.is_some(),
            cumulative_gas_used: receipt.cumulative_gas_used,
            logs_bloom: receipt.logs_bloom
        }
    }
}

struct TxReceiptWithinBlock {
    receipt: TxReceiptPartial,
    block_hash: Bytes32
}

pub fn get_receipt<MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_ENCODED_LEN>(
    chain_id: Field,
    block_number: u64,
    tx_idx: Field,
    _max_receipt_proof_len: PhantomReceiptProofLen<MAX_RECEIPT_PROOF_LEN>,
    _max_receipt_rlp_len: PhantomReceiptRlpLen<MAX_RECEIPT_ENCODED_LEN>
) -> TxReceiptWithinBlock {
    let (tx_type, receipt, proof): (TxType, TxReceiptPartial, ReceiptProof<MAX_RECEIPT_PROOF_LEN, MAX_ENCODED_RECEIPT_LENGTH>) = get_receipt_unconstrained(chain_id, block_number, tx_idx);
    let header = get_header(chain_id, block_number);
    verify_receipt(
        block_number,
        tx_idx,
        tx_type,
        receipt,
        proof,
        header.receipts_root
    );
    TxReceiptWithinBlock { receipt, block_hash: header.hash }
}

#[oracle(get_receipt)]
unconstrained fn get_receipt_oracle<MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_ENCODED_LEN>(
    _chain_id: Field,
    _block_number: u64,
    _tx_idx: Field
) -> (TxType, ForeignCallTxReceiptPartial, ReceiptProof<MAX_RECEIPT_PROOF_LEN, MAX_ENCODED_RECEIPT_LENGTH>) {}

unconstrained fn get_receipt_unconstrained<MAX_RECEIPT_PROOF_LEN, MAX_RECEIPT_ENCODED_LEN>(
    chain_id: Field,
    block_number: u64,
    tx_idx: Field
) -> (TxType, TxReceiptPartial, ReceiptProof<MAX_RECEIPT_PROOF_LEN, MAX_ENCODED_RECEIPT_LENGTH>) {
    let (tx_type, receipt, proof) = get_receipt_oracle(chain_id, block_number, tx_idx);

    let receipt = TxReceiptPartial {
        status: make_option(receipt.status, receipt.status_is_some),
        state_root: make_option(receipt.state_root, receipt.state_root_is_some),
        cumulative_gas_used: receipt.cumulative_gas_used,
        logs_bloom: receipt.logs_bloom
    };
    (tx_type, receipt, proof)
}

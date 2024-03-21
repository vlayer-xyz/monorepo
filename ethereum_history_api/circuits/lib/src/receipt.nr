use crate::misc::types::{Bytes32, Address};
use crate::header::get_header;
use crate::verifiers::receipt::verify_receipt;
use dep::std::unsafe::zeroed;

global BLOOM_FILTER_SIZE = 256;
global MAX_RECEIPT_KEY_LEN = 3;
global MAX_RECEIPT_TREE_DEPTH = 7;

struct Log<MAX_LOG_DATA_SIZE> {
    address: Address,
    topics: [Bytes32; 4],
    data: [u8; MAX_LOG_DATA_SIZE]
}

struct TxReceipt<LOG_NUM, MAX_LOG_DATA_SIZE> {
    blob_gas_used: Field,
    blob_gas_price: Field,
    status: u1,
    state_root: Bytes32,
    cumulative_gas_used: Field,
    logs_bloom: [u8; BLOOM_FILTER_SIZE]
}

struct PhantomReceiptProofLen<MAX_RECEIPT_PROOF_LENGTH> {}
struct PhantomReceiptRlpLen<MAX_RECEIPT_RLP_LENGTH> {}

struct TxReceiptProof<MAX_RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH> {
    key: [u8; MAX_RECEIPT_KEY_LEN],
    value: [u8; MAX_RECEIPT_RLP_LENGTH],
    proof: [u8; MAX_RECEIPT_PROOF_LENGTH],
    depth: u64
}

struct TxReceiptWithinBlock<LOG_NUM, MAX_LOG_DATA_SIZE> {
    receipt: TxReceipt<LOG_NUM, MAX_LOG_DATA_SIZE>,
    block_hash: Bytes32
}

pub fn get_receipt<LOG_NUM, MAX_LOG_DATA_SIZE, MAX_RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>(
    block_number: Field,
    tx_idx: Field,
    _max_receipt_proof_len: PhantomReceiptProofLen<MAX_RECEIPT_PROOF_LENGTH>,
    _max_receipt_rlp_len: PhantomReceiptRlpLen<MAX_RECEIPT_RLP_LENGTH>
) -> TxReceiptWithinBlock<LOG_NUM, MAX_LOG_DATA_SIZE> {
    let (receipt, proof): (TxReceipt<LOG_NUM, MAX_LOG_DATA_SIZE>, TxReceiptProof<MAX_RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>) = get_receipt_unconstrained(block_number, tx_idx);
    zeroed()
}

#[oracle(get_receipt)]
unconstrained fn get_receipt_oracle<LOG_NUM, MAX_LOG_DATA_SIZE, MAX_RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>(
    _block_number: Field,
    _tx_idx: Field
) -> (TxReceipt<LOG_NUM, MAX_LOG_DATA_SIZE>, TxReceiptProof<MAX_RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>) {}

unconstrained fn get_receipt_unconstrained<LOG_NUM, MAX_LOG_DATA_SIZE, MAX_RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>(
    block_number: Field,
    tx_idx: Field
) -> (TxReceipt<LOG_NUM, MAX_LOG_DATA_SIZE>, TxReceiptProof<MAX_RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>) {
    get_receipt_oracle(
        block_number,
        tx_idx
    )
}

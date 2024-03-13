use crate::misc::types::{Bytes32, Address};
use crate::header::get_header;
use crate::verifiers::receipt::verify_receipt;

global BLOOM_FILTER_SIZE = 2048;
global MAX_LOG_DATA_SIZE = 256; // 8 * 32 (Eth word length)
global MAX_RECEIPT_LENGTH = 1024; // TODO: Pick a reasonable value
global MAX_RECEIPT_TREE_DEPTH = 3;
global RECEIPT_PROOF_LEN = 1024; // TODO: Pick a reasonable value

struct Log {
    address: Address,
    topics: [Bytes32; 4],
    data: [u8; MAX_LOG_DATA_SIZE]
}

struct TxReceipt<LOG_NUM> {
    blob_gas_used: Field,
    blob_gas_price: Field,
    status: u1,
    state_root: Bytes32,
    cumulative_gas_used: Field,
    logs_bloom: [u8; BLOOM_FILTER_SIZE],
    logs: [Log; LOG_NUM]
}

struct TxReceiptProof {
    key: [u8; MAX_RECEIPT_TREE_DEPTH],
    value: [u8; MAX_RECEIPT_LENGTH],
    proof: [u8; RECEIPT_PROOF_LEN],
    depth: u64
}

struct TxReceiptWithinBlock<LOG_NUM> {
    receipt: TxReceipt<LOG_NUM>,
    block_hash: Bytes32
}

pub fn get_receipt<LOG_NUM>(block_number: Field, tx_idx: Field) -> TxReceiptWithinBlock<LOG_NUM> {
    let header = get_header(block_number);
    let (receipt, receipt_proof) = get_receipt_unconstrained(block_number, tx_idx);
    // TODO: This breaks nargo proof: https://discord.com/channels/1113924620781883405/1211646790864994336/1211646790864994336
    // assert(header.number == block_number, "block number does not match the argument");
    verify_receipt(block_number, tx_idx, receipt, receipt_proof, header.receipts_root);
    TxReceiptWithinBlock {receipt, block_hash: header.hash}
}

#[oracle(get_receipt)]
unconstrained fn get_receipt_oracle<N>(_block_number: Field, _tx_idx: Field) -> (TxReceipt<N>, TxReceiptProof) {}

unconstrained fn get_receipt_unconstrained<N>(block_number: Field, tx_idx: Field) -> (TxReceipt<N>, TxReceiptProof) {
    get_receipt_oracle(block_number, tx_idx)
}

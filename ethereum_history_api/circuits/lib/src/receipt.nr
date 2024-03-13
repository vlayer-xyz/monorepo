use crate::misc::types::{Bytes32, Address};
use crate::header::get_header;
use crate::verifiers::receipt::verify_receipt;
use dep::std::unsafe::zeroed;

global BLOOM_FILTER_SIZE = 2048;
global MAX_RECEIPT_TREE_DEPTH = 6;

// MAX_TRIE_NODE_LENGTH = Max(MAX_LEAF_LENGTH, MAX_BRANCH_LENGTH)
// Leafs can have arbitrary length and will be constrained by generics, but in normal case - branches are longer than leaves
// MAX_BRANCH_LENGTH = MAX_RLP_LIST_HEADER_LENGTH + 16 * MAX_RLP_ELEMENT_LENGTH + LENGTH_OF_NULL_ELEMENT
// MAX_RLP_LIST_HEADER_LENGTH = 1 + MAX_LENGTH_BYTES
// MAX_LENGTH_BYTES = 2
// MAX_RLP_LIST_HEADER_LENGTH = 3
// MAX_RLP_ELEMENT_LENGTH = 32
// LENGTH_OF_NULL_ELEMENT = 1
// MAX_BRANCH_LENGTH = 3 + 16 * 32 + 1 = 515
global MAX_TRIE_NODE_LENGTH: u64 = 515;

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
    logs_bloom: [u8; BLOOM_FILTER_SIZE],
    logs: [Log<MAX_LOG_DATA_SIZE>; LOG_NUM]
}

struct FakeTurbofishReceiptProofLen<RECEIPT_PROOF_LENGTH> {}
struct FakeTurbofishReceiptRlpLen<MAX_RECEIPT_RLP_LENGTH> {}

struct TxReceiptProof<RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH> {
    key: [u8; MAX_RECEIPT_TREE_DEPTH],
    value: [u8; MAX_RECEIPT_RLP_LENGTH],
    proof: [u8; RECEIPT_PROOF_LENGTH],
    depth: u64
}

struct TxReceiptWithinBlock<LOG_NUM, MAX_LOG_DATA_SIZE> {
    receipt: TxReceipt<LOG_NUM, MAX_LOG_DATA_SIZE>,
    block_hash: Bytes32
}

pub fn get_receipt<LOG_NUM, MAX_LOG_DATA_SIZE, RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>(
    block_number: Field,
    tx_idx: Field,
    _max_receipt_proof_len: FakeTurbofishReceiptProofLen<RECEIPT_PROOF_LENGTH>,
    _max_receipt_rlp_len: FakeTurbofishReceiptRlpLen<MAX_RECEIPT_RLP_LENGTH>
) -> TxReceiptWithinBlock<LOG_NUM, MAX_LOG_DATA_SIZE> {
    assert(false, "Not implemented");
    zeroed()
}

#[oracle(get_receipt)]
unconstrained fn get_receipt_oracle<LOG_NUM, MAX_LOG_DATA_SIZE, RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>(
    _block_number: Field,
    _tx_idx: Field,
    _max_receipt_proof_len: FakeTurbofishReceiptProofLen<RECEIPT_PROOF_LENGTH>,
    _max_receipt_rlp_len: FakeTurbofishReceiptRlpLen<MAX_RECEIPT_RLP_LENGTH>
) -> (TxReceipt<LOG_NUM, MAX_LOG_DATA_SIZE>, TxReceiptProof<RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>) {}

unconstrained fn get_receipt_unconstrained<LOG_NUM, MAX_LOG_DATA_SIZE, RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>(
    block_number: Field,
    tx_idx: Field,
    _max_receipt_proof_len: FakeTurbofishReceiptProofLen<RECEIPT_PROOF_LENGTH>,
    _max_receipt_rlp_len: FakeTurbofishReceiptRlpLen<MAX_RECEIPT_RLP_LENGTH>
) -> (TxReceipt<LOG_NUM, MAX_LOG_DATA_SIZE>, TxReceiptProof<RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>) {
    get_receipt_oracle(
        block_number,
        tx_idx,
        _max_receipt_proof_len,
        _max_receipt_rlp_len
    )
}

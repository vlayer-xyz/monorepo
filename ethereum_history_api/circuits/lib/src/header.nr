use crate::misc::types::Bytes32;
use crate::verifiers::header::verify_header;

global MAX_HEADER_RLP_LEN = 708;
global ETHEREUM_MAINNET_ID = 1;
global ETHEREUM_SEPOLIA_ID = 58008;

struct BlockHeaderPartial {
    number: Field,
    hash: Bytes32,
    state_root: Bytes32,
    transactions_root: Bytes32,
    receipts_root: Bytes32,
}

struct BlockHeaderRlp {
    length: Field,
    data: [u8; MAX_HEADER_RLP_LEN]
}

pub fn get_header(block_number: Field) -> BlockHeaderPartial {
    let (block_header_partial, block_header_rlp) = get_header_unconstrained(block_number);
    verify_header(ETHEREUM_MAINNET_ID, block_header_partial, block_header_rlp);
    assert(block_header_partial.number == block_number, "Block number does not match the argument");
    block_header_partial
}

#[oracle(get_header)]
unconstrained fn get_header_oracle(_block_no: Field) -> (BlockHeaderPartial, BlockHeaderRlp) {}

unconstrained fn get_header_unconstrained(block_no: Field) -> (BlockHeaderPartial, BlockHeaderRlp) {
    get_header_oracle(block_no)
}

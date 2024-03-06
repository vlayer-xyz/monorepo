use crate::misc::types::Bytes32;
use crate::verifiers::header::verify_header;

global MAX_HEADER_RLP_SIZE = 708;

struct BlockHeaderPartial {
    number: Field,
    hash: Bytes32,
    state_root: Bytes32,
    transactions_root: Bytes32,
    receipts_root: Bytes32,
}

struct BlockHeaderRlp {
    length: Field,
    data: [u8; MAX_HEADER_RLP_SIZE]
}

pub fn get_header(block_number: Field) -> BlockHeaderPartial {
    let (block_header_partial, block_header_rlp) = get_header_unconstrained(block_number);
    verify_header(block_header_partial, block_header_rlp);
    // TODO: This breaks nargo proof: https://discord.com/channels/1113924620781883405/1211646790864994336/1211646790864994336
    // assert(block_header_partial.number == block_number, "block number does not match the argument");
    block_header_partial
}

#[oracle(get_header)]
unconstrained fn get_header_oracle(_block_no: Field) -> (BlockHeaderPartial, BlockHeaderRlp) {}

unconstrained fn get_header_unconstrained(block_no: Field) -> (BlockHeaderPartial, BlockHeaderRlp) {
    get_header_oracle(block_no)
}

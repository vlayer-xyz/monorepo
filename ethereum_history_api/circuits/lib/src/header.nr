use dep::proof::{rlp::{decode1, RLP_List}, byte_value};
use dep::std::test::OracleMock;
use dep::std::hash::keccak256;
use dep::std::wrapping_add;
use crate::misc::arrays::{sub_array_equals, alter_array, sub_array_equals_up_to_length};
use dep::u2b::{u40_to_u8};
use crate::misc::types::Bytes32;

global MAX_HEADER_RLP_SIZE = 708;
global HEADER_FIELDS_COUNT = 17;
global STATE_ROOT_INDEX = 3;
global TRANSACTIONS_ROOT_INDEX = 4;
global RECEIPTS_ROOT_INDEX = 5;
global BLOCK_NUMBER_INDEX = 8;

struct BlockHeaderPartial {
    number: Field,
    hash: Bytes32,
    state_root: Bytes32,
    transactions_root: Bytes32,
    receipts_root: Bytes32,
}

pub fn get_header(block_number: Field) -> BlockHeaderPartial {
    let (block_header_partial, block_header_rlp) = get_header_unconstrained(block_number);
    verify_header(block_header_partial, block_header_rlp);
    block_header_partial
}

struct BlockHeaderRlp {
    length: Field,
    data: [u8; MAX_HEADER_RLP_SIZE]
}

#[oracle(get_header)]
unconstrained fn get_header_oracle(_block_no: Field) -> (BlockHeaderPartial, BlockHeaderRlp) {}

unconstrained fn get_header_unconstrained(block_no: Field) -> (BlockHeaderPartial, BlockHeaderRlp) {
    get_header_oracle(block_no)
}

pub(crate) fn verify_header(block_header_partial: BlockHeaderPartial, block_header_rlp: BlockHeaderRlp) {
    let rlp_list:RLP_List<HEADER_FIELDS_COUNT> = decode1(block_header_rlp.data);

    // We use u40 for block number because even if block time is 1s - it would take 34865 years to reach u40
    let block_number = u40_to_u8(block_header_partial.number as u40);
    let (block_number, block_number_length) = byte_value(block_number);

    assert(rlp_list.length[BLOCK_NUMBER_INDEX] == block_number_length, "block number length does not match");
    assert(
        sub_array_equals_up_to_length(
            block_number,
            block_header_rlp.data,
            rlp_list.offset[BLOCK_NUMBER_INDEX],
            block_number_length as u64
        ), "block number does not match"
    );
    assert(
        sub_array_equals(
            keccak256(block_header_rlp.data, block_header_rlp.length as u32),
            block_header_partial.hash,
            0
        ), "block hash does not match"
    );
    assert(
        sub_array_equals(
            block_header_partial.state_root,
            block_header_rlp.data,
            rlp_list.offset[STATE_ROOT_INDEX]
        ), "state_root does not match"
    );
    assert(
        sub_array_equals(
            block_header_partial.transactions_root,
            block_header_rlp.data,
            rlp_list.offset[TRANSACTIONS_ROOT_INDEX]
        ), "transactions_root does not match"
    );
    assert(
        sub_array_equals(
            block_header_partial.receipts_root,
            block_header_rlp.data,
            rlp_list.offset[RECEIPTS_ROOT_INDEX]
        ), "receipts_root does not match"
    );
}

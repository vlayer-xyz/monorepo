use dep::proof::rlp::{decode1, RLP_List};
use dep::std::test::OracleMock;
use dep::std::hash::keccak256;
use dep::std::wrapping_add;
use crate::arrays::{sub_array_equals, alter_array};
use crate::HASH_LENGTH;
use crate::types::{Address, Bytes32};

global MAX_HEADER_RLP_SIZE = 708;
global HEADER_FIELDS_COUNT = 17;
global STATE_ROOT_INDEX = 3;
global TRANSACTIONS_ROOT_INDEX = 4;
global RECEIPTS_ROOT_INDEX = 5;
global BLOCK_NUMBER_INDEX = 8;

struct BlockHeaderFromOracle {
    partial: BlockHeaderPartial,
    encoded: BlockHeaderEncoded
}

struct BlockHeaderPartial {
    state_root: Bytes32,
    transactions_root: Bytes32,
    receipts_root: Bytes32,
    number: Field,
    hash: Bytes32
}

struct BlockHeaderEncoded {
    encoded_len: Field,
    encoded: [u8; MAX_HEADER_RLP_SIZE]
}

#[oracle(get_header)]
unconstrained fn get_header_oracle(_block_no: Field) -> BlockHeaderFromOracle {}

unconstrained fn get_header_unconstrained(block_no: Field) -> BlockHeaderFromOracle {
    get_header_oracle(block_no)
}

pub(crate) fn verify_header(block_no: Field) -> BlockHeaderPartial {
    let header = get_header_unconstrained(block_no);
    let rlp_list:RLP_List<HEADER_FIELDS_COUNT> = decode1(header.encoded.encoded);
    assert(
        sub_array_equals(
            header.partial.state_root,
            header.encoded.encoded,
            rlp_list.offset[STATE_ROOT_INDEX]
        ), "state_root does not match"
    );
    assert(
        sub_array_equals(
            header.partial.transactions_root,
            header.encoded.encoded,
            rlp_list.offset[TRANSACTIONS_ROOT_INDEX]
        ), "transactions_root does not match"
    );
    assert(
        sub_array_equals(
            header.partial.receipts_root,
            header.encoded.encoded,
            rlp_list.offset[RECEIPTS_ROOT_INDEX]
        ), "receipts_root does not match"
    );
    assert(
        sub_array_equals(
            keccak256(header.encoded.encoded, header.encoded.encoded_len as u32),
            header.partial.hash,
            0
        ), "hash does not match"
    );
    header.partial
}

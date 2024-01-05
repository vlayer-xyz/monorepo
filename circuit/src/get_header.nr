use dep::proof::rlp::{decode1, RLP_List};
use dep::std::test::OracleMock;
use dep::std::hash::keccak256;
use crate::arrays::{sub_array_equals, alter_array};

global MAX_HEADER_RLP_SIZE = 708;
global HEADER_FIELDS_COUNT = 17;
global STATE_ROOT_INDEX = 3;
global TRANSACTIONS_ROOT_INDEX = 4;
global RECEIPTS_ROOT_INDEX = 5;
global BLOCK_NUMBER_INDEX = 8;

struct BlockHeaderPartial {
    stateRoot: [u8; 32],
    transactionsRoot: [u8; 32],
    receiptsRoot: [u8; 32],
    number: Field,
    hash: [u8; 32],
    encoded_len: Field,
    encoded: [u8; MAX_HEADER_RLP_SIZE]
}

#[oracle(get_header)]
unconstrained fn get_header_oracle(_block_no: Field) -> BlockHeaderPartial {}

unconstrained fn get_header(block_no: Field) -> BlockHeaderPartial {
    let header = get_header_oracle(block_no);
    let rlp_list:RLP_List<HEADER_FIELDS_COUNT> = decode1(header.encoded);
    assert(
        sub_array_equals(
            header.stateRoot,
            header.encoded,
            rlp_list.offset[STATE_ROOT_INDEX]
        )
    );
    assert(
        sub_array_equals(
            header.transactionsRoot,
            header.encoded,
            rlp_list.offset[TRANSACTIONS_ROOT_INDEX]
        )
    );
    assert(
        sub_array_equals(
            header.receiptsRoot,
            header.encoded,
            rlp_list.offset[RECEIPTS_ROOT_INDEX]
        )
    );
    assert(
        sub_array_equals(
            keccak256(header.encoded, header.encoded_len as u32),
            header.hash,
            0
        )
    );
    header
}

global stateRoot = [
    236, 60, 148, 177, 139, 138, 28, 255, 125, 96, 248, 210, 88, 236, 114, 51, 18, 147, 41, 40, 98, 107, 76, 147, 85, 235, 74, 179, 86, 142, 199, 247
];

global transactionsRoot = [
    80, 247, 56, 88, 14, 214, 153, 240, 70, 151, 2, 199, 204, 198, 62, 210, 229, 27, 192, 52, 190, 148, 121, 183, 191, 244, 230, 141, 238, 132, 172, 207
];

global receiptsRoot = [
    41, 176, 86, 47, 113, 64, 87, 77, 208, 213, 13, 238, 138, 39, 27, 34, 225, 160, 167, 183, 143, 202, 88, 247, 198, 3, 112, 216, 49, 123, 162, 169
];

global encoded = [
    249, 2, 0, 160, 224, 169, 74, 122, 60, 150, 23, 64, 21, 134, 177, 162, 112, 37, 210, 217, 103, 19, 50, 210, 45, 84, 14, 10, 247, 43, 6, 145, 112, 56, 15, 42, 160, 29, 204, 77, 232, 222, 199, 93, 122, 171, 133, 181, 103, 182, 204, 212, 26, 211, 18, 69, 27, 148, 138, 116, 19, 240, 161, 66, 253, 64, 212, 147, 71, 148, 186, 94, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 160, 236, 60, 148, 177, 139, 138, 28, 255, 125, 96, 248, 210, 88, 236, 114, 51, 18, 147, 41, 40, 98, 107, 76, 147, 85, 235, 74, 179, 86, 142, 199, 247, 160, 80, 247, 56, 88, 14, 214, 153, 240, 70, 151, 2, 199, 204, 198, 62, 210, 229, 27, 192, 52, 190, 148, 121, 183, 191, 244, 230, 141, 238, 132, 172, 207, 160, 41, 176, 86, 47, 113, 64, 87, 77, 208, 213, 13, 238, 138, 39, 27, 34, 225, 160, 167, 183, 143, 202, 88, 247, 198, 3, 112, 216, 49, 123, 162, 169, 185, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 2, 0, 0, 1, 136, 1, 99, 69, 120, 93, 138, 0, 0, 131, 1, 85, 52, 130, 7, 158, 66, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136, 0, 0, 0, 0, 0, 0, 0, 0, 130, 3, 107, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

global number: Field = 7;

global hash = [
    106, 37, 28, 124, 60, 93, 202, 123,
    66, 64, 122, 55, 82, 255, 72, 243,
    187, 202, 31, 171, 127, 152, 104, 55,
    29, 153, 24, 218, 241, 152, 141, 31
];

global encoded_len: Field = 515;

global blockPartial = BlockHeaderPartial { stateRoot, transactionsRoot, receiptsRoot, number, hash, encoded_len, encoded };

#[test]
fn test_get_header_success() {
    OracleMock::mock("get_header").returns(blockPartial);
    assert(get_header(0).stateRoot == stateRoot);
}

#[test(should_fail_with = "explicit trap hit in brillig")]
fn test_get_header_invalid_state_root() {
    let stateRoot = alter_array(stateRoot);
    let blockPartial = BlockHeaderPartial { stateRoot, transactionsRoot, receiptsRoot, number, hash, encoded_len, encoded };
    OracleMock::mock("get_header").returns(blockPartial);
    assert(get_header(0).stateRoot == stateRoot);
}

#[test(should_fail_with = "explicit trap hit in brillig")]
fn test_get_header_invalid_transactions_root() {
    let transactionsRoot = alter_array(transactionsRoot);
    let blockPartial = BlockHeaderPartial { stateRoot, transactionsRoot, receiptsRoot, number, hash, encoded_len, encoded };
    OracleMock::mock("get_header").returns(blockPartial);
    assert(get_header(0).stateRoot == stateRoot);
}

#[test(should_fail_with = "explicit trap hit in brillig")]
fn test_get_header_invalid_receipt_root() {
    let receiptsRoot = alter_array(receiptsRoot);
    let blockPartial = BlockHeaderPartial { stateRoot, transactionsRoot, receiptsRoot, number, hash, encoded_len, encoded };
    OracleMock::mock("get_header").returns(blockPartial);
    assert(get_header(0).stateRoot == stateRoot);
}

#[test(should_fail_with = "explicit trap hit in brillig")]
fn test_get_header_invalid_hash() {
    let hash = alter_array(hash);
    let blockPartial = BlockHeaderPartial { stateRoot, transactionsRoot, receiptsRoot, number, hash, encoded_len, encoded };
    OracleMock::mock("get_header").returns(blockPartial);
    assert(get_header(0).stateRoot == stateRoot);
}

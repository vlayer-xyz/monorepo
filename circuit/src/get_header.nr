use dep::proof::rlp::{decode1, RLP_List};
use dep::std::test::OracleMock;
use dep::std::hash::keccak256;
use dep::std::wrapping_add;
use crate::arrays::{sub_array_equals};

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

unconstrained fn get_header_unconstraint(block_no: Field) -> BlockHeaderPartial {
    let header = get_header_oracle(block_no);
    header
}

pub(crate) fn get_header(block_no: Field) -> BlockHeaderPartial {
    let header = get_header_unconstraint(block_no);
    let rlp_list:RLP_List<HEADER_FIELDS_COUNT> = decode1(header.encoded);
    assert(
        sub_array_equals(
            header.stateRoot,
            header.encoded,
            rlp_list.offset[STATE_ROOT_INDEX]
        ), "stateRoot"
    );
    assert(
        sub_array_equals(
            header.transactionsRoot,
            header.encoded,
            rlp_list.offset[TRANSACTIONS_ROOT_INDEX]
        ), "transactionsRoot"
    );
    assert(
        sub_array_equals(
            header.receiptsRoot,
            header.encoded,
            rlp_list.offset[RECEIPTS_ROOT_INDEX]
        ), "receiptsRoot"
    );
    assert(
        sub_array_equals(
            keccak256(header.encoded, header.encoded_len as u32),
            header.hash,
            0
        ), "hash"
    );
    header
}

global stateRoot = [
  215, 141,  79,  24,  46, 189, 127,  13,
  200, 108,  91,  50, 139, 115, 249, 234,
   61, 254,  23, 238,  86, 251, 180, 144,
  217, 182, 126, 218, 196, 142,  43,   4
];

global transactionsRoot = [
  255, 173, 242, 165,  13, 138, 162,  14,
   25, 195, 126, 163, 133, 134,  73, 152,
   35,  30, 101,  36, 210,   0,  66,  95,
    7, 100, 121,  98, 156, 178,  13, 156
];

global receiptsRoot = [
  188, 180, 119, 228,   6, 245,  71, 231,
  159,  11, 204,  84,   6, 246,  15, 187,
  167,  12, 241,  43, 135,  79, 189, 214,
   70, 203, 108,  30, 129, 214,  77, 177
];

global encoded = [
    249,2,25,160,19,21,201,73,89,37,80,59,153,254,57,28,81,144,176,60,146,139,10,250,94,186,37,127,9,62,130,86,4,189,77,86,160,29,204,77,232,222,199,93,122,171,133,181,103,182,204,212,26,211,18,69,27,148,138,116,19,240,161,66,253,64,212,147,71,148,26,217,30,224,143,33,190,61,224,186,43,166,145,142,113,77,166,180,88,54,160,215,141,79,24,46,189,127,13,200,108,91,50,139,115,249,234,61,254,23,238,86,251,180,144,217,182,126,218,196,142,43,4,160,255,173,242,165,13,138,162,14,25,195,126,163,133,134,73,152,35,30,101,36,210,0,66,95,7,100,121,98,156,178,13,156,160,188,180,119,228,6,245,71,231,159,11,204,84,6,246,15,187,167,12,241,43,135,79,189,214,70,203,108,30,129,214,77,177,185,1,0,195,32,0,0,0,2,18,4,128,48,69,193,128,5,18,4,65,2,208,8,14,0,17,0,1,133,42,32,76,208,1,151,8,0,224,2,128,128,128,80,0,8,65,0,0,66,1,4,3,129,132,128,8,0,139,136,130,74,136,0,2,48,38,13,52,8,56,128,0,34,1,64,11,132,4,10,20,0,6,40,0,144,98,0,0,98,4,32,16,26,53,128,128,68,56,64,11,9,48,5,3,170,10,2,32,0,30,129,16,0,10,146,32,10,66,56,8,58,68,0,98,0,65,16,6,0,2,129,48,0,20,0,14,174,16,192,48,88,164,16,71,147,16,12,21,0,136,1,0,132,4,138,14,8,2,66,0,16,0,0,10,144,152,8,6,24,8,0,0,4,0,208,0,1,68,4,64,128,16,0,68,0,9,16,129,0,17,7,88,133,27,64,64,80,4,42,72,52,8,1,103,16,2,0,66,2,3,16,4,16,0,1,0,9,4,144,0,25,5,70,4,98,41,0,25,17,162,12,0,64,128,136,16,38,0,38,100,34,42,197,0,129,0,88,180,0,0,70,0,2,216,128,8,64,0,0,135,46,38,50,149,46,50,2,131,216,149,206,132,1,201,195,128,131,146,76,111,132,98,8,59,71,145,72,105,118,101,111,110,32,101,117,45,104,101,97,118,121,45,50,160,177,238,117,88,226,61,16,20,183,11,226,32,129,182,2,102,20,146,190,245,181,33,27,66,215,254,132,219,243,76,222,54,136,51,31,50,205,141,53,54,177,133,10,34,188,49,200
];

global number: Field = 14194126;

global hash = [
  190, 138, 165, 148,  93,  51, 119, 230,
   94, 208, 103,  87,  85,  93,  13,  75,
  171, 226, 105,   9, 117, 116, 194,  16,
   19,  62,  89, 207, 107, 193, 125,  24
];

global encoded_len: Field = 540;

// NOTE: This is the same block as in https://github.com/aragonzkresearch/noir-trie-proofs/blob/main/tests/depth_8_state_proof/Prover.toml
global blockPartial = BlockHeaderPartial { stateRoot, transactionsRoot, receiptsRoot, number, hash, encoded_len, encoded };

fn alter_array<N>(array: [u8; N]) -> [u8; N] {
    let mut copy = array.map(|x| x);
    copy[0] = wrapping_add(copy[0], 1);
    copy
}

#[test]
fn test_get_header_success() {
    let _ = OracleMock::mock("get_header").returns(blockPartial);
    assert(get_header(0).stateRoot == stateRoot);
}

#[test(should_fail_with = "stateRoot")]
fn test_get_header_invalid_state_root() {
    let stateRoot = alter_array(stateRoot);
    let blockPartial = BlockHeaderPartial { stateRoot, transactionsRoot, receiptsRoot, number, hash, encoded_len, encoded };
    let _ = OracleMock::mock("get_header").returns(blockPartial);
    assert(get_header(0).stateRoot == stateRoot);
}

#[test(should_fail_with = "transactionsRoot")]
fn test_get_header_invalid_transactions_root() {
    let transactionsRoot = alter_array(transactionsRoot);
    let blockPartial = BlockHeaderPartial { stateRoot, transactionsRoot, receiptsRoot, number, hash, encoded_len, encoded };
    let _ = OracleMock::mock("get_header").returns(blockPartial);
    assert(get_header(0).stateRoot == stateRoot);
}

#[test(should_fail_with = "receiptsRoot")]
fn test_get_header_invalid_receipt_root() {
    let receiptsRoot = alter_array(receiptsRoot);
    let blockPartial = BlockHeaderPartial { stateRoot, transactionsRoot, receiptsRoot, number, hash, encoded_len, encoded };
    let _ = OracleMock::mock("get_header").returns(blockPartial);
    assert(get_header(0).stateRoot == stateRoot);
}

#[test(should_fail_with = "hash")]
fn test_get_header_invalid_hash() {
    let hash = alter_array(hash);
    let blockPartial = BlockHeaderPartial { stateRoot, transactionsRoot, receiptsRoot, number, hash, encoded_len, encoded };
    let _ = OracleMock::mock("get_header").returns(blockPartial);
    assert(get_header(0).stateRoot == stateRoot);
}

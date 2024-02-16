use dep::std::test::OracleMock;
use crate::header::{get_header, verify_header, BlockHeaderPartial, BlockHeaderRlp};
use crate::misc::arrays::alter_array;

global number: Field = 7;

global hash = [
    106, 37, 28, 124, 60, 93, 202, 123,
    66, 64, 122, 55, 82, 255, 72, 243,
    187, 202, 31, 171, 127, 152, 104, 55,
    29, 153, 24, 218, 241, 152, 141, 31
];

global state_root = [
    236, 60, 148, 177, 139, 138, 28, 255, 125, 96, 248, 210, 88, 236, 114, 51, 18, 147, 41, 40, 98, 107, 76, 147, 85, 235, 74, 179, 86, 142, 199, 247
];

global transactions_root = [
    80, 247, 56, 88, 14, 214, 153, 240, 70, 151, 2, 199, 204, 198, 62, 210, 229, 27, 192, 52, 190, 148, 121, 183, 191, 244, 230, 141, 238, 132, 172, 207
];

global receipts_root = [
    41, 176, 86, 47, 113, 64, 87, 77, 208, 213, 13, 238, 138, 39, 27, 34, 225, 160, 167, 183, 143, 202, 88, 247, 198, 3, 112, 216, 49, 123, 162, 169
];

global encoded_length: Field = 515;

global encoded_data = [
    249, 2, 0, 160, 224, 169, 74, 122, 60, 150, 23, 64, 21, 134, 177, 162, 112, 37, 210, 217, 103, 19, 50, 210, 45, 84, 14, 10, 247, 43, 6, 145, 112, 56, 15, 42, 160, 29, 204, 77, 232, 222, 199, 93, 122, 171, 133, 181, 103, 182, 204, 212, 26, 211, 18, 69, 27, 148, 138, 116, 19, 240, 161, 66, 253, 64, 212, 147, 71, 148, 186, 94, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 160, 236, 60, 148, 177, 139, 138, 28, 255, 125, 96, 248, 210, 88, 236, 114, 51, 18, 147, 41, 40, 98, 107, 76, 147, 85, 235, 74, 179, 86, 142, 199, 247, 160, 80, 247, 56, 88, 14, 214, 153, 240, 70, 151, 2, 199, 204, 198, 62, 210, 229, 27, 192, 52, 190, 148, 121, 183, 191, 244, 230, 141, 238, 132, 172, 207, 160, 41, 176, 86, 47, 113, 64, 87, 77, 208, 213, 13, 238, 138, 39, 27, 34, 225, 160, 167, 183, 143, 202, 88, 247, 198, 3, 112, 216, 49, 123, 162, 169, 185, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 2, 0, 0, 1, 136, 1, 99, 69, 120, 93, 138, 0, 0, 131, 1, 85, 52, 130, 7, 158, 66, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136, 0, 0, 0, 0, 0, 0, 0, 0, 130, 3, 107, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

global block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
global block_header_rlp = BlockHeaderRlp { length: encoded_length, data: encoded_data};

#[test]
fn test_get_header_success() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));
    let header = get_header(0);
    assert_eq(block_header_partial.number, header.number);
    assert_eq(block_header_partial.hash, header.hash);
    assert_eq(block_header_partial.state_root, header.state_root);
    assert_eq(block_header_partial.transactions_root, header.transactions_root);
    assert_eq(block_header_partial.receipts_root, header.receipts_root);
}

#[test]
fn test_verify_header_success() {
    verify_header(block_header_partial, block_header_rlp);
}

#[test(should_fail_with = "block hash does not match")]
fn test_verify_header_invalid_hash() {
    let hash = alter_array(hash);
    let block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(block_header_partial, block_header_rlp);
}

#[test(should_fail_with = "state_root does not match")]
fn test_verify_header_invalid_state_root() {
    let state_root = alter_array(state_root);
    let block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(block_header_partial, block_header_rlp);
}

#[test(should_fail_with = "transactions_root does not match")]
fn test_verify_header_invalid_transactions_root() {
    let transactions_root = alter_array(transactions_root);
    let block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(block_header_partial, block_header_rlp);
}

#[test(should_fail_with = "receipts_root does not match")]
fn test_verify_header_invalid_receipt_root() {
    let receipts_root = alter_array(receipts_root);
    let block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
    verify_header(block_header_partial, block_header_rlp);
}

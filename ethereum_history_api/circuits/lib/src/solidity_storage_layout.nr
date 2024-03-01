use crate::misc::{
    types::{U256, Bytes32},
    U256::add_u64_to_U256,
    arrays::pad_left
};
use dep::std::hash::keccak256;

fn concat_Bytes32_values(left: Bytes32, right: Bytes32) -> [u8; 64] {
    let mut result = [0; 64];
    for i in 0..32 {
        result[i] = left[i];
    }
    for i in 0..32 {
        result[32 + i] = right[i];
    }
    result
}

pub fn map(slot: U256, key: U256) -> U256 {
    let preimage = concat_Bytes32_values(key, slot);
    let storage_slot = keccak256(preimage, 64);
    storage_slot
}

pub fn array(slot: U256, index: u64) -> U256 {
    let mut array_storage_slot = keccak256(slot, 32);
    let array_element_storage_slot = add_u64_to_U256(array_storage_slot, index);
    array_element_storage_slot
}

#[test]
fn test_concat_Bytes32_values() {
    let left = pad_left([1]);
    let right = pad_left([2]);
    let result = concat_Bytes32_values(left, right);
    assert_eq(
        result, [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2
    ]
    );
}

#[test]
fn test_map() {
    let usdc_balance_slot = pad_left([9]);
    // 0x55fe002aeff02f77364de339a1292923a15844b8
    let circle_address = pad_left([85, 254, 0, 42, 239, 240, 47, 119, 54, 77, 227, 57, 161, 41, 41, 35, 161, 88, 68, 184]);
    // 0x57d18af793d7300c4ba46d192ec7aa095070dde6c52c687c6d0d92fb8532b305
    let usdc_circle_storage_slot = [
        87, 209, 138, 247, 147, 215, 48, 12, 75, 164, 109, 25, 46, 199, 170, 9, 80, 112, 221, 230, 197, 44, 104, 124, 109, 13, 146, 251, 133, 50, 179, 5
    ];

    // https://evm.storage/eth/19333810/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/balanceAndBlacklistStates.0x55fe002aeff02f77364de339a1292923a15844b8#table
    assert_eq(map(usdc_balance_slot, circle_address), usdc_circle_storage_slot);
}

#[test]
fn test_array() {
    let mcd_cure_srcs_slot = pad_left([2]);
    let index = 1;
    // 0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5acf
    let mcd_cure_srcs_first_element_storage_slot = [
        64, 87, 135, 250, 18, 168, 35, 224, 242, 183, 99, 28, 196, 27, 59, 168, 130, 139, 51, 33, 202, 129, 17, 17, 250, 117, 205, 58, 163, 187, 90, 207
    ];

    // https://evm.storage/eth/19333810/0x0085c9feab2335447e1f4dc9bf3593a8e28bdfc7/srcs.1#map
    assert_eq(array(mcd_cure_srcs_slot, index), mcd_cure_srcs_first_element_storage_slot);
}

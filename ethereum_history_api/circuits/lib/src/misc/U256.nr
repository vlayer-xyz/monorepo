use crate::misc::types::U256;
use crate::misc::arrays::{array_equals, pad_left};
use dep::std::wrapping_add;
use dep::u2b::u64_to_u8;

global MAX_U8: u8 = 255;

fn is_overflow(left: u8, right: u8) -> bool {
    // We want to check if `left + right > MAX_U8`
    // `left + right` can overflow, but `MAX_U8 - right` does not
    left > MAX_U8 - right
}

#[test]
fn test_is_overflow() {
    assert(is_overflow(255, 1));
    assert(is_overflow(100, 200));
    assert(is_overflow(255, 255));

    assert(!is_overflow(255, 0));
    assert(!is_overflow(0, 255));
    assert(!is_overflow(100, 100));
    assert(!is_overflow(0, 0));
}

fn overflowing_add(lhs: u8, rhs: u8) -> (u8, u1) {
    let sum = wrapping_add(lhs, rhs);
    let carry = is_overflow(lhs, rhs) as u1;
    (sum, carry)
}

#[test]
fn test_overflowing_add() {
    assert(overflowing_add(255, 1) == (0, 1));
    assert(overflowing_add(100, 200) == (44, 1));
    assert(overflowing_add(255, 255) == (254, 1));

    assert(overflowing_add(255, 0) == (255, 0));
    assert(overflowing_add(0, 255) == (255, 0));
    assert(overflowing_add(100, 100) == (200, 0));
    assert(overflowing_add(0, 0) == (0, 0));
}

fn overflowing_add_with_previous_carry(left: u8, right: u8, carry: u1) -> (u8, u1) {
    let (sum, carry1) = overflowing_add(left, right);
    let (sum, carry2) = overflowing_add(sum, carry as u8);
    // It's never the case that both `carry1` and `carry2` are 1
    // The maximum value of u8 is 255, so even if lhs is 255 and rhs is 255 and carry is 1,
    // the sum will be 511 which is less than 512
    let carry = carry1 | carry2;
    (sum, carry)
}

#[test]
fn test_overflowing_add_with_previous_carry() {
    assert(overflowing_add_with_previous_carry(255, 0, 0) == (255, 0));
    assert(overflowing_add_with_previous_carry(0, 255, 0) == (255, 0));
    assert(overflowing_add_with_previous_carry(100, 100, 0) == (200, 0));
    assert(overflowing_add_with_previous_carry(0, 0, 0) == (0, 0));

    assert(overflowing_add_with_previous_carry(255, 1, 0) == (0, 1));
    assert(overflowing_add_with_previous_carry(100, 200, 0) == (44, 1));
    assert(overflowing_add_with_previous_carry(255, 255, 0) == (254, 1));

    assert(overflowing_add_with_previous_carry(255, 0, 1) == (0, 1));
    assert(overflowing_add_with_previous_carry(0, 255, 1) == (0, 1));
    assert(overflowing_add_with_previous_carry(100, 100, 1) == (201, 0));
    assert(overflowing_add_with_previous_carry(0, 0, 1) == (1, 0));

    assert(overflowing_add_with_previous_carry(255, 1, 1) == (1, 1));
    assert(overflowing_add_with_previous_carry(100, 200, 1) == (45, 1));
    assert(overflowing_add_with_previous_carry(255, 255, 1) == (255, 1));
}

pub(crate) fn add_u64_to_U256(left: U256, right: u64) -> U256 {
    let right: U256 = pad_left(u64_to_u8(right));
    let mut result = [0; 32];
    let mut carry = 0;
    for i in 0..32 {
        // This addtion is Big Endian because U256 is Big Endian in Solidity/EVM
        let reverse_i = 31 - i;
        let (sum, local_carry) = overflowing_add_with_previous_carry(left[reverse_i], right[reverse_i], carry);
        result[reverse_i] = sum;
        carry = local_carry;
    }
    assert(carry == 0, "Overflow");
    result
}

#[test]
fn test_add_u64_to_U256() {
    let one = pad_left([1]);
    let two = 2;
    let three = pad_left([3]);

    assert(array_equals(add_u64_to_U256(one, two), three));
}

#[test]
fn test_add_u64_to_U256_with_carry() {
    let one = pad_left([255]);
    let two = 2;
    let three = pad_left([1, 1]);

    assert(array_equals(add_u64_to_U256(one, two), three));
}

#[test(should_fail_with="Overflow")]
fn test_add_u64_to_U256_overflows() {
    let MAX_U256 = [255; 32];
    let one = 1;

    let _ = add_u64_to_U256(MAX_U256, one);
}

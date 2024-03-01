use crate::misc::types::U256;
use crate::misc::arrays::pad_left;
use dep::std::wrapping_add;
use dep::u2b::u64_to_u8;

global MAX_U8: u8 = 255;

pub(crate) fn is_overflow(left: u8, right: u8) -> bool {
    // We want to check if `left + right > MAX_U8`
    // `left + right` can overflow, but `MAX_U8 - right` does not
    left > MAX_U8 - right
}

pub(crate) fn overflowing_add(lhs: u8, rhs: u8) -> (u8, u1) {
    let sum = wrapping_add(lhs, rhs);
    let carry = is_overflow(lhs, rhs) as u1;
    (sum, carry)
}

pub(crate) fn overflowing_add_with_previous_carry(left: u8, right: u8, carry: u1) -> (u8, u1) {
    let (sum, carry1) = overflowing_add(left, right);
    let (sum, carry2) = overflowing_add(sum, carry as u8);
    // It's never the case that both `carry1` and `carry2` are 1
    // The maximum value of u8 is 255, so even if lhs is 255 and rhs is 255 and carry is 1,
    // the sum will be 511 which is less than 512
    let carry = carry1 | carry2;
    (sum, carry)
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

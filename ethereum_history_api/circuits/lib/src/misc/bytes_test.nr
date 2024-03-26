use crate::misc::bytes::{nibbles_to_byte, nibbles_to_bytes, left_to_right_padding, shift_right_by_one};

#[test]
fn test_left_to_right_padding_empty() {
    let (shifted, shifted_by) = left_to_right_padding([]);
    assert(shifted == []);
    assert(shifted_by == 0);
}

#[test]
fn test_left_to_right_padding_even() {
    let (shifted, shifted_by) = left_to_right_padding([0x0, 0x0, 0xf, 0xf]);
    assert(shifted == [0xf, 0xf, 0x0, 0x0]);
    assert(shifted_by == 2);
}

#[test]
fn test_left_to_right_padding_odd() {
    let (shifted, shifted_by) = left_to_right_padding([0x0, 0x0, 0x0, 0xf]);
    assert(shifted == [0x0, 0xf, 0x0, 0x0]);
    assert(shifted_by == 2);
}

#[test]
fn test_shift_right_by_one() {
    let mut arr = [0xa, 0x0, 0xb, 0x0];
    shift_right_by_one(&mut arr);
    assert(arr == [0x0, 0xa, 0x0, 0xb]);
}

#[test(should_fail_with="Last element must be zero to shift the array right by one")]
fn test_shift_right_by_one_fail() {
    let non_zero = 0x1;
    let mut arr = [0xa, 0x0, 0xb, non_zero];
    shift_right_by_one(&mut arr);
}

#[test]
fn test_nibbles_to_byte_zero() {
    assert(nibbles_to_byte(0x0, 0x0) == 0x0);
}

#[test]
fn test_nibbles_to_byte_one_nibble() {
    assert(nibbles_to_byte(0x0, 0xf) == 0xf);
}

#[test]
fn test_nibbles_to_byte_two_nibbles() {
    assert(nibbles_to_byte(0xf, 0xf) == 0xff);
}

#[test(should_fail_with="Nibble value must be less than 16")]
fn test_nibbles_to_byte_fail_overflow() {
    assert(nibbles_to_byte(0x00, 0x10) == 0x10);
}

#[test]
fn test_nibbles_to_bytes_empty() {
    assert(nibbles_to_bytes([]) == []);
}

#[test]
fn test_nibbles_to_bytes_zero() {
    assert(nibbles_to_bytes([0x0, 0x0]) == [0x0]);
}

#[test]
fn test_nibbles_to_bytes_simple() {
    assert(nibbles_to_bytes([0x0, 0xf, 0xf, 0x0]) == [0x0f, 0xf0]);
}

#[test]
fn test_nibbles_to_bytes() {
    assert(
        nibbles_to_bytes(
        [
        0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf, 0x0, 0x1, 0x2, 0x3
    ]
    )
        == [0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0x01, 0x23]
    );
}

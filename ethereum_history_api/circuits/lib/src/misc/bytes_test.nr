use crate::misc::bytes::{nibbles_to_byte, nibbles_to_bytes, bytes_to_field, left_nibble_shift};

#[test]
fn test_left_nibble_shift_empty() {
    let (shifted, shifted_by_len) = left_nibble_shift([]);
    assert(shifted == []);
    assert(shifted_by_len == 0);
}

#[test]
fn test_left_nibble_shift_even() {
    let (shifted, shifted_by_len) = left_nibble_shift([0x0, 0x0, 0xf, 0xf]);
    assert(shifted == [0xf, 0xf, 0x0, 0x0]);
    assert(shifted_by_len == 2);
}

#[test]
fn test_left_nibble_shift_odd() {
    let (shifted, shifted_by_len) = left_nibble_shift([0x0, 0x0, 0x0, 0xf]);
    assert(shifted == [0x0, 0xf, 0x0, 0x0]);
    assert(shifted_by_len == 2);
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
    assert(nibbles_to_bytes([0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xA, 0xB, 0xC, 0xD, 0xE, 0xF, 0x0, 0x1, 0x2, 0x3]) == [0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF, 0x01, 0x23]);
}

#[test]
fn test_bytes_to_field_zero() {
    assert(bytes_to_field([0x0], 0, 1) == 0x0);
}

#[test]
fn test_bytes_to_field_no_offset() {
    assert(bytes_to_field([0xac, 0xbf], 0, 2) == 0xacbf);
}

#[test]
fn test_bytes_to_field_offset() {
    assert(bytes_to_field([0x12, 0x56, 0x78, 0xbc, 0xde], 1, 3) == 0x5678bc);
}
use crate::misc::bytes::{nibbles_to_byte, nibbles_to_bytes};

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

#[test(should_fail_with="Incorrect nibbles to byte conversion")]
fn test_nibbles_to_byte_fail_incorrect_conversion() {
    assert(nibbles_to_byte(0x3, 0xa) == 0xa3, "Incorrect nibbles to byte conversion");
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

#[test(should_fail_with="Incorrect nibbles to bytes conversion")]
fn test_nibbles_to_bytes_fail() {
    assert(nibbles_to_bytes([0xa, 0xc]) == [0xbc], "Incorrect nibbles to bytes conversion");
}
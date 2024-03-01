use crate::misc::{
    U256::{
        is_overflow,
        overflowing_add,
        overflowing_add_with_previous_carry,
        add_u64_to_U256
    },
    arrays::{array_equals, pad_left}
};

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

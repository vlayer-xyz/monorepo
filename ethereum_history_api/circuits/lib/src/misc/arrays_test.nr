use crate::misc::arrays::{sub_array_equals_up_to_length, sub_array_equals, array_equals, pad_left};

#[test]
fn test_assert_sub_array_equals() {
    let value: [Field; 4] = [1, 2, 0, 0];
    let array: [Field; 6] = [42, 1, 2, 3, 4, 5];
    assert(sub_array_equals_up_to_length(value, array, 1, 2));
}

#[test(should_fail_with = "Not equals")]
fn test_assert_sub_array_equals_full_length_not_equals() {
    let value: [Field; 4] = [1, 2, 0, 0];
    let array: [Field; 6] = [42, 1, 2, 3, 4, 5];
    assert(sub_array_equals_up_to_length(value, array, 1, 4), "Not equals");
}

#[test]
fn test_assert_sub_array_equals_full_length() {
    let value: [Field; 4] = [1, 2, 0, 0];
    let array: [Field; 6] = [42, 1, 2, 0, 0, 5];
    assert(sub_array_equals_up_to_length(value, array, 1, 4));
}

#[test(should_fail_with = "subarray index out of bound")]
fn test_assert_sub_array_equals_subarray_out_of_bound() {
    let value: [Field; 4] = [1, 2, 0, 0];
    let array: [Field; 6] = [42, 1, 2, 0, 0, 5];
    assert(sub_array_equals_up_to_length(value, array, 1, 5));
}

#[test(should_fail)] // Unfortunately in-loop index access happens before the assert
fn test_assert_sub_array_equals_array_out_of_bound() {
    let value: [Field; 4] = [1, 2, 0, 0];
    let array: [Field; 5] = [0, 0, 1, 2, 0];
    assert(sub_array_equals_up_to_length(value, array, 2, 3));
}

#[test]
fn test_sub_array_equals() {
    let sub_array: [Field; 3] = [2, 3, 4];
    let array: [Field; 5] = [1, 2, 3, 4, 5];
    assert(sub_array_equals(sub_array, array, 1));
    assert(!sub_array_equals(sub_array, array, 0));
    assert(!sub_array_equals(sub_array, array, 2));
    assert(!sub_array_equals(sub_array, array, 2));
}

#[test(should_fail_with = "array index out of bound")]
fn test_sub_array_equals_index_out_of_bound() -> bool {
    let sub_array: [Field; 3] = [2, 3, 4];
    let array: [Field; 5] = [1, 2, 3, 4, 5];
    sub_array_equals(sub_array, array, 3)
}

#[test]
fn test_empty_array_equals() {
    let empty_array: [Field; 0] = [];
    assert(array_equals(empty_array, empty_array));
}

#[test]
fn test_array_equals() {
    let array: [Field; 3] = [1, 2, 3];
    assert(array_equals(array, array));
}

#[test(should_fail_with = "Arrays not equal")]
fn test_array_not_equals() {
    let array: [Field; 3] = [1, 2, 3];
    let other_array: [Field; 3] = [1, 2, 4];
    assert(array_equals(array, other_array), "Arrays not equal");
}

#[test]
fn test_pad_left() {
    let array: [u8; 2] = [1, 2];
    let padded_array: [u8; 4] = [0, 0, 1, 2];
    assert(array_equals(padded_array, pad_left(array)));
}

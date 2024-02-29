use crate::misc::arrays::{sub_array_equals_up_to_length, sub_array_equals, array_equals};

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
    let a: [Field; 3] = [2, 3, 4];
    let b: [Field; 5] = [1, 2, 3, 4, 5];
    assert(sub_array_equals(a, b, 1));
    assert(!sub_array_equals(a, b, 0));
    assert(!sub_array_equals(a, b, 2));
    assert(!sub_array_equals(a, b, 2));
}

#[test(should_fail_with = "array index out of bound")]
fn test_sub_array_equals_index_out_of_bound() -> bool {
    let a: [Field; 3] = [2, 3, 4];
    let b: [Field; 5] = [1, 2, 3, 4, 5];
    sub_array_equals(a, b, 3)
}

#[test]
fn test_array_equals() {
    let a: [Field; 0] = [];
    let b: [Field; 3] = [1, 2, 3];
    assert(array_equals(a, a));
    assert(array_equals(b, b));
}

#[test(should_fail)]
fn test_array_not_equals() {
    let a: [Field; 3] = [1, 2, 3];
    let b: [Field; 3] = [1, 2, 4];
    let c: [Field; 4] = [1, 2, 3, 4];
    let d: [Field; 4] = [0, 2, 3, 4];
    assert(array_equals(a, b));
    assert(array_equals(c, d));
}

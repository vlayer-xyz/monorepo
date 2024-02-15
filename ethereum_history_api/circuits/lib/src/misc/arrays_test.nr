use crate::misc::arrays::{assert_sub_array_equals, sub_array_equals};

#[test]
fn test_assert_sub_array_equals() {
    let value: [Field; 4] = [1, 2, 0, 0];
    let array: [Field; 6] = [42, 1, 2, 3, 4, 5];
    assert_sub_array_equals(value, array, 1, 2);
}

#[test(should_fail_with = "subarray not equals")]
fn test_assert_sub_array_equals_full_length_not_equals() {
    let value: [Field; 4] = [1, 2, 0, 0];
    let array: [Field; 6] = [42, 1, 2, 3, 4, 5];
    assert_sub_array_equals(value, array, 1, 4);
}

#[test]
fn test_assert_sub_array_equals_full_length() {
    let value: [Field; 4] = [1, 2, 0, 0];
    let array: [Field; 6] = [42, 1, 2, 0, 0, 5];
    assert_sub_array_equals(value, array, 1, 4);
}

#[test(should_fail_with = "subarray index out of bound")]
fn test_assert_sub_array_equals_subarray_out_of_bound() {
    let value: [Field; 4] = [1, 2, 0, 0];
    let array: [Field; 6] = [42, 1, 2, 0, 0, 5];
    assert_sub_array_equals(value, array, 1, 5);
}

#[test(should_fail)] // Unfortunately in-loop index access happens before the assert
fn test_assert_sub_array_equals_array_out_of_bound() {
    let value: [Field; 4] = [1, 2, 0, 0];
    let array: [Field; 5] = [0, 0, 1, 2, 0];
    assert_sub_array_equals(value, array, 2, 3);
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

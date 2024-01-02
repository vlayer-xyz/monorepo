pub fn sub_array_equals<T, N, M>(subarray: [T; N], array: [T; M], start_index: Field) -> bool {
    let mut result = true;
    for i in 0..N {
        result &= subarray[i] == array[start_index + i];
    }
    result
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


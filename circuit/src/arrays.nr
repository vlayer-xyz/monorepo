use dep::std;

pub fn sub_array_equals<T, N, M>(subarray: [T; N], array: [T; M], start_index: Field) -> bool where T: Eq {
    assert(start_index as u64 + N <= M, "Invalid range");
    let mut result = true;
    for i in 0..N {
        result &= subarray[i] == array[start_index as u64 + i];
    }
    result
}

fn alter_array<N>(array: [u8; N]) -> [u8; N] {
    let mut copy = array.map(|x| x);
    copy[0] = std::wrapping_add(copy[0], 1);
    copy
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

#[test(should_fail_with = "Invalid range")]
fn test_sub_array_equals_index_out_of_bound() -> bool {
    let a: [Field; 3] = [2, 3, 4];
    let b: [Field; 5] = [1, 2, 3, 4, 5];
    sub_array_equals(a, b, 3)
}

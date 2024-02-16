use dep::std::wrapping_add;

pub fn alter_array<N>(array: [u8; N]) -> [u8; N] {
    let mut copy = array.map(|x| x);
    copy[0] = wrapping_add(copy[0], 1);
    copy
}

pub fn sub_array_equals_up_to_length<T, N, M>(subarray: [T; N], array: [T; M], offset: Field, length: u64) -> bool where T: Eq {
    assert(length <= N, "subarray index out of bound");
    assert(offset as u64 + N <= M, "array index out of bound");
    let mut result = true;
    for i in 0..N {
        let loop_p = i < length;
        let equals_p = (subarray[i] == array[offset as u64 + i]);
        result &= !loop_p | equals_p;
    }
    result
}

pub fn sub_array_equals<T, N, M>(subarray: [T; N], array: [T; M], offset: Field) -> bool where T: Eq {
    assert(offset as u64 + N <= M, "array index out of bound");
    let mut result = true;
    for i in 0..N {
        result &= subarray[i] == array[offset as u64 + i];
    }
    result
}

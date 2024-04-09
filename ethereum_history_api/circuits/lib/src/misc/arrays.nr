use dep::std::{unsafe::zeroed, wrapping_add};

pub fn alter_array<N>(array: [u8; N]) -> [u8; N] {
    let mut copy = array.map(|x| x);
    copy[0] = wrapping_add(copy[0], 1);
    copy
}

pub fn resize<TItem, NEW_LEN, OLD_LEN>(src: [TItem; OLD_LEN]) -> [TItem; NEW_LEN] {
    assert(NEW_LEN >= OLD_LEN, "New length must be greater than or equal to old length");
    let mut dest = [zeroed(); NEW_LEN];
    for i in 0..OLD_LEN {
        dest[i] = src[i];
    }
    dest
}

/// Fills destination array with content of source array starting from the starting position.
///
/// # Arguments
/// * `dest` - Destination array
/// * `src` - Source array
/// * `offset` - Offset in source array 
pub(crate) fn memcpy<N, M>(dest: &mut [u8; N], src: [u8; M], offset: u64) {
    memcpy_up_to_length(dest, src, offset, N);
}

pub(crate) fn memcpy_up_to_length<N, M>(dest: &mut [u8; N], src: [u8; M], offset: u64, length: u64) {
    assert(offset + length <= M, "source index out of bound");
    for i in 0..N {
        let do_copy = i < length;
        if do_copy {
            (*dest)[i] = src[offset + i];
        }
    }
}

pub fn sub_array_equals_up_to_length<T, N, M>(
    subarray: [T; N],
    array: [T; M],
    offset: u64,
    length: u64
) -> bool where T: Eq {
    assert(length <= N, "subarray index out of bound");
    assert(offset + N <= M, "array index out of bound");
    let mut result = true;
    for i in 0..N {
        let loop_p = i < length;
        let equals_p = (subarray[i] == array[offset + i]);
        result &= !loop_p | equals_p;
    }
    result
}

pub fn sub_array_equals<T, N, M>(subarray: [T; N], array: [T; M], offset: u64) -> bool where T: Eq {
    assert(offset + N <= M, "array index out of bound");
    let mut result = true;
    for i in 0..N {
        result &= subarray[i] == array[offset + i];
    }
    result
}

pub fn array_equals<T, N>(array1: [T; N], array2: [T; N]) -> bool where T: Eq {
    sub_array_equals(array1, array2, 0)
}

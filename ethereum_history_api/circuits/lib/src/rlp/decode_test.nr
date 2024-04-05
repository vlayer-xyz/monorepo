use crate::rlp::decode::{copy_subarray, strict_if};

#[test]
fn stict_if_test() {
    assert(strict_if(true, 1, 2) == 1);
    assert(strict_if(false, 1, 2) == 2);
}

#[test]
fn copy_subarray_test() {
    let input = [1, 2, 3, 4, 5];
    assert(copy_subarray(input, 0) == [1, 2, 3, 4, 5]);
    assert(copy_subarray(input, 2) == [3, 4, 5]);
    assert(copy_subarray(input, 5) == []);
    assert(copy_subarray(input, 6) == []);
}


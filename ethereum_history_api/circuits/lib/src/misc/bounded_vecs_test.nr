use crate::misc::bounded_vecs::bounded_vec_from_array;
use crate::misc::arrays::sub_array_equals_up_to_length;

#[test]
fn success() {
    let arr = [1, 2, 3, 4, 5];
    let vec: BoundedVec <u8, 10> = bounded_vec_from_array(arr);
    assert_eq(vec.len(), 5);
    assert_eq(vec.max_len(), 10);
    assert(sub_array_equals_up_to_length(arr, vec.storage(), 0, 5));
}


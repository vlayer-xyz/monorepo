use crate::misc::bounded_vecs::bounded_vec_from_array;

#[test]
fn success() {
    let arr = [1, 2, 3, 4, 5];
    let vec = bounded_vec_from_array(arr);
    assert_eq(vec.len(), 5);
    assert_eq(vec.storage(), arr);
}


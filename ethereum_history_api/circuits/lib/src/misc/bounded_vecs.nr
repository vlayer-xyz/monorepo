pub fn bounded_vec_from_array<T, N, M>(array: [T; N]) -> BoundedVec<T, M> {
    let mut vec = BoundedVec::new();
    vec.extend_from_array(array);

    vec
}

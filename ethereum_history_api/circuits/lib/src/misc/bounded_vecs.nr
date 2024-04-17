pub fn bounded_vec_from_array<T, N>(array: [T; N]) -> BoundedVec<T, N> {
    let mut vec = BoundedVec::new();
    vec.extend_from_array(array);

    vec
}

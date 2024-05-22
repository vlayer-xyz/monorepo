pub fn bounded_vec_from_array<T, N, M>(array: [T; N]) -> BoundedVec<T, M> {
    assert(N <= M, "Array size exceeds bounded vector size");
    let mut vec = BoundedVec::new();
    vec.extend_from_array(array);

    vec
}

pub fn bounded_vec_map<U, T, N, Env>(
    bounded_vec: BoundedVec<T, N> ,
    f: fn[Env](T) -> U
) -> BoundedVec<U, N> {
    let mut result: BoundedVec<U, N> = BoundedVec::new();
    for i in 0..N {
        if (i < bounded_vec.len) {
            result.push(f(bounded_vec.get(i)));
        }
    }
    result
}

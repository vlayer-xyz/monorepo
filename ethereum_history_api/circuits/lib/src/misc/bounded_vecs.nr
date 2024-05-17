pub fn bounded_vec_from_array<T, N, M>(array: [T; N]) -> BoundedVec<T, M> {
    assert(N <= M, "Array size exceeds bounded vector size");
    let mut vec = BoundedVec::new();
    vec.extend_from_array(array);

    vec
}

pub fn bounded_vec_map<N, T, S, Env>(input: BoundedVec<T, N>, f: fn[Env](T) -> S) -> BoundedVec<S, N> {
    let mut result: BoundedVec<S, N> = BoundedVec::new();
    for i in 0..N {
        if (i < input.len) {
            result.push(f(input.get(i)));
        }
    }
    result
}

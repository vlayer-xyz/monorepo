use crate::misc::functor::Functor;

pub fn bounded_vec_from_array<T, N, M>(array: [T; N]) -> BoundedVec<T, M> {
    assert(N <= M, "Array size exceeds bounded vector size");
    let mut vec = BoundedVec::new();
    vec.extend_from_array(array);

    vec
}

impl<T, N> Functor<T, N> for BoundedVec<T, N> {
    fn fmap<U, Env>(self, f: fn[Env](T) -> U) -> BoundedVec<U, N> {
        let mut result: BoundedVec<U, N> = BoundedVec::new();
        for i in 0..N {
            if (i < self.len) {
                result.push(f(self.get(i)));
            }
        }
        result
    }
}

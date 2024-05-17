trait Functor<T, N> {
    fn fmap<U, Env>(self, f: fn[Env](T) -> U) -> BoundedVec<U, N>;
}

trait Iterator<T> {
    fn for_each<Env>(self, f: fn[Env](T) -> ());
}

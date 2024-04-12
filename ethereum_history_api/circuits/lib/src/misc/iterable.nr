trait Iterable<Env, TItem> {
  fn each(self, callback: fn[Env] (TItem) -> ()) -> ();
}

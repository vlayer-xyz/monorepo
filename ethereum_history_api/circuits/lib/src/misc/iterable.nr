trait Iterable<TItem> {
  fn each(self, callback: fn (TItem) -> ()) -> ();
}

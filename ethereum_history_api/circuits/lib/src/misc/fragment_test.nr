use crate::misc::fragment::Fragment;

#[test]
fn success_new() {
    let fragment = Fragment::new(1, 2, [1, 2, 3, 4]);
    assert_eq(fragment.data, [1, 2, 3, 4]);
    assert_eq(fragment.offset, 1);
    assert_eq(fragment.length, 2);
}

#[test(should_fail_with = "Fragment data exceeds data length")]
fn fail_new_exceeding_length() {
    let _ = Fragment::new(3, 3, [1, 2, 3, 4]);
}

#[test]
fn success_new_focused() {
    let fragment = Fragment::new_focused([1, 2, 3, 4]);
    assert_eq(fragment.data, [1, 2, 3, 4]);
    assert_eq(fragment.offset, 0);
    assert_eq(fragment.length, 4);
}

#[test]
fn success_focus() {
    let fragment = Fragment::new(1, 2, [1, 2, 3, 4]);
    let focused_fragment = fragment.focus();
    assert_eq(focused_fragment.data, [2, 3]);
    assert_eq(focused_fragment.offset, 0);
    assert_eq(focused_fragment.length, 2);
}

#[test]
fn success_focus_full() {
    let fragment = Fragment::new(0, 4, [1, 2, 3, 4]);
    let focused_fragment = fragment.focus();
    assert_eq(focused_fragment.data, [1, 2, 3, 4]);
    assert_eq(focused_fragment.offset, 0);
    assert_eq(focused_fragment.length, 4);
}

#[test(should_fail_with = "New max length is smaller than fragment length")]
fn fail_focus() {
    let fragment = Fragment::new(1, 2, [1, 2, 3, 4]);
    let _: Fragment<1> = fragment.focus();
}

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
fn succescc_focus_full() {
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

#[test(should_fail_with = "Saw first element")]
fn succes_each_first() {
    let fragment = Fragment::new(0, 3, [1, 2, 3]);
    fragment.each(|c: u8|{assert_eq(c, 2, "Saw first element");});
}

#[test(should_fail_with = "Saw second element")]
fn succes_each_second() {
    let fragment = Fragment::new(0, 3, [1, 1, 3]);
    fragment.each(|c: u8|{assert_eq(c, 3, "Saw second element");});
}

#[test(should_fail_with = "Saw third element")]
fn succes_each_third() {
    let fragment = Fragment::new(0, 3, [1, 1, 1]);
    fragment.each(|c: u8|{assert_eq(c, 4, "Saw third element");});
}

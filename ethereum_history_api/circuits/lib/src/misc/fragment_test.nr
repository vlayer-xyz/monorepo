use crate::misc::fragment::Fragment;

#[test]
fn success_new() {
    let fragment = Fragment::new(1, 2, [1, 2, 3, 4]);
    assert_eq(fragment.data, [1, 2, 3, 4]);
    assert_eq(fragment.offset, 1);
    assert_eq(fragment.length, 2);
}

#[test(should_fail_with = "Fragment length exceeds data length")]
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

#[test]
fn success_is_empty() {
    let fragment = Fragment::new_with_length(0, [1, 2, 3]);
    assert(fragment.is_empty());
}

#[test]
fn success_is_empty_non_empty() {
    let fragment = Fragment::new_with_length(1, [1, 2, 3]);
    assert(!fragment.is_empty());
}

#[test]
fn success_at() {
    let fragment = Fragment::new(1, 2, [1, 2, 3]);
    assert(fragment.at(0) == 2);
    assert(fragment.at(1) == 3);
}

#[test(should_fail_with="Index out of bounds, tried to access index 2 but the length is 2")]
fn fail_at() {
    let fragment = Fragment::new(1, 2, [1, 2, 3]);
    let _ = fragment.at(2);
}

#[test]
fn success_set() {
    let mut fragment = Fragment::new(1, 2, [1, 2, 3]);
    fragment.set(0, 4);
    assert(fragment.at(0) == 4);
}

#[test(should_fail_with="Index out of bounds, tried to set at index 2 but the length is 2")]
fn fail_set() {
    let mut fragment = Fragment::new(1, 2, [1, 2, 3]);
    fragment.set(2, 4);
}

#[test]
fn success_pop_front() {
    let mut fragment = Fragment::new(1, 2, [1, 2, 3]);
    assert(fragment.pop_front() == 2);
    assert(fragment.pop_front() == 3);
}

#[test(should_fail_with="Cannot pop from an empty slice")]
fn fail_pop_front() {
    let mut fragment = Fragment::new(1, 2, [1, 2, 3]);
    let _ = fragment.pop_front();
    let _ = fragment.pop_front();
    let _ = fragment.pop_front();
}

#[test]
fn simple_eq() {
    let fragment1 = Fragment::new(1, 2, [1, 2, 3]);
    let fragment2 = Fragment::new(1, 2, [1, 2, 3]);
    assert(fragment1 == fragment2);
}

#[test]
fn eq() {
    let fragment1 = Fragment::new(2, 3, [1, 1, 3, 4, 5, 1]);
    let fragment2 = Fragment::new(1, 3, [0, 3, 4, 5, 0, 0]);
    assert(fragment1 == fragment2);
}

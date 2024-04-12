use crate::slice::imp::Slice;

#[test]
fn test_new() {
    let s = Slice::new([0; 10]);
    assert(s.data == [0; 10]);
    assert(s.offset == 0);
    assert(s.len == 0);
}

#[test]
fn test_new_extended() {
    let data = [1, 2, 3, 4, 5];
    let s = Slice::new_extended(data, 2, 3);
    assert(s.data == [1, 2, 3, 4, 5]);
    assert(s.offset == 2);
    assert(s.len == 3);
}

#[test]
fn test_at() {
    let s = Slice::new_extended([0, 1, 2, 3, 4], 2, 2);
    assert(s.at(0) == 2);
    assert(s.at(1) == 3);
}

#[test(should_fail_with="Index out of bounds")]
fn test_at_fail() {
    let s = Slice::new_extended([0, 1, 2, 3, 4], 2, 2);
    let _ = s.at(2);
}
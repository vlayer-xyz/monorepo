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

#[test(should_fail_with="Given offset with length exceed capacity of the slice: 3")]
fn test_new_extended_fail() {
    let data = [0; 3];
    let _ = Slice::new_extended(data, 1, 3);
}

#[test]
fn test_is_empty() {
    let s = Slice::new([0; 10]);
    assert(s.is_empty());
}

#[test]
fn test_is_not_empty() {
    let s = Slice::new_extended([0; 10], 0, 10);
    assert(!s.is_empty());
}

#[test]
fn test_at() {
    let s = Slice::new_extended([0, 1, 2, 3, 4], 2, 2);
    assert(s.at(0) == 2);
    assert(s.at(1) == 3);
}

#[test(should_fail_with="Index out of bounds, tried to access index 2 but the length is 2")]
fn test_at_fail() {
    let s = Slice::new_extended([0, 1, 2, 3, 4], 2, 2);
    let _ = s.at(2);
}

#[test]
fn test_push_back() {
    let mut s = Slice::new([0; 3]);
    s.push_back(1);
    assert(s.data == [1, 0, 0]);
    assert(s.offset == 0);
    assert(s.len() == 1);
    s.push_back(2);
    assert(s.data == [1, 2, 0]);
    assert(s.offset == 0);
    assert(s.len() == 2);
}

#[test(should_fail_with="Slice capacity exceeded, maximum capacity is 3")]
fn test_push_back_fail() {
    let mut s = Slice::new([0; 3]);
    s.push_back(1);
    s.push_back(2);
    s.push_back(3);
    s.push_back(4);
}

#[test]
fn test_pop_back() {
    let mut s = Slice::new_extended([1, 2, 3], 0, 3);
    assert(s.pop_back() == 3);
    assert(s.offset == 0);
    assert(s.len() == 2);
    assert(s.pop_back() == 2);
    assert(s.offset == 0);
    assert(s.len() == 1);
}

#[test(should_fail_with="Cannot pop from an empty slice")]
fn test_pop_back_fail() {
    let mut s = Slice::new_extended([0; 3], 0, 1);
    assert(s.len() == 1);
    let _ = s.pop_back();
    let _ = s.pop_back();
}

#[test]
fn test_pop_front() {
    let mut s = Slice::new_extended([1, 2], 0, 2);
    assert(s.pop_front() == 1);
    assert(s.offset == 1);
    assert(s.len() == 1);
    assert(s.pop_front() == 2);
    assert(s.offset == 2);
    assert(s.len() == 0);
}

#[test(should_fail_with="Cannot pop from an empty slice")]
fn test_pop_front_fail() {
    let mut s = Slice::new_extended([0; 3], 0, 1);
    assert(s.len() == 1);
    let _ = s.pop_front();
    let _ = s.pop_front();
}


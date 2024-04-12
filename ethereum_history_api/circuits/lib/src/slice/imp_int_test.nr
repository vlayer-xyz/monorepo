use crate::slice::imp::Slice;

#[test]
fn test_simple() {
    let mut s = Slice::new([0; 3]);
    assert(s.is_empty());
    s.push_back(0);
    s.push_back(1);
    s.push_back(2);
    assert(s.at(0) == 0);
    assert(s.at(1) == 1);
    assert(s.len() == 3);

    assert(s.pop_back() == 2);
    assert(s.pop_front() == 0);
    assert(s.at(0) == 1);
    assert(s.len() == 1);
}

#[test]
fn test_simple_extended() {
    let mut s = Slice::new_extended([0, 0, 1, 2], 1, 3);
    assert(s.at(0) == 0);
    assert(s.at(1) == 1);
    assert(s.len() == 3);

    assert(s.pop_back() == 2);
    assert(s.pop_front() == 0);
    assert(s.at(0) == 1);
    assert(s.len() == 1);
}

#[test]
fn test_pops() {
    let mut s = Slice::new_extended([0, 1, 2, 3], 0, 4);
    assert(s.pop_back() == 3);
    assert(s.pop_front() == 0);
    assert(s.pop_back() == 2);
    assert(s.pop_front() == 1);
    assert(s.is_empty());
}

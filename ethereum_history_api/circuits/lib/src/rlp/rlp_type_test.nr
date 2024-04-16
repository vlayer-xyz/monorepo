use crate::rlp::rlp_type::RlpList;
use crate::misc::fragment::Fragment;

pub fn create_rlp_list() -> RlpList<3, 5>{
    let fragment1: Fragment<3> = Fragment::new_focused([1, 2, 3]);
    let fragment2: Fragment<3> = Fragment::new_focused([4, 5, 6]);

    let mut vec: BoundedVec<Fragment<3>, 5> = BoundedVec::new();
    vec.extend_from_array([fragment1, fragment2]);

    let mut rlp_list: RlpList<3, 5> = vec;

    rlp_list
}

#[test]
fn success_create() {
    let rlp_list = create_rlp_list();

    assert_eq(rlp_list.len(), 2);
    assert_eq(rlp_list.max_len(), 5);
    assert_eq(rlp_list.get(1).data, [4, 5, 6]);
}

#[test]
fn modify_rlp_list() {
    let mut rlp_list = create_rlp_list();

    assert_eq(rlp_list.len(), 2);

    let fragment: Fragment<3> = Fragment::new_focused([1, 1, 1]);
    rlp_list.push(fragment);
    assert_eq(rlp_list.len(), 3);

    let _ = rlp_list.pop();
    assert_eq(rlp_list.len(), 2);
}

use crate::rlp::list::{RlpList, create_rlp_list};
use crate::rlp::fragment::RlpFragment;
use crate::misc::fragment::Fragment;
use crate::rlp::decode::{LIST, STRING};

global fragments = [
      RlpFragment { 
        offset: 0, 
        length: 3,
        data_type: LIST
      },
      RlpFragment {
        offset: 2, 
        length: 1, 
        data_type: STRING
      },
      RlpFragment { 
        offset: 0, 
        length: 2, 
        data_type: LIST
      }
  ];

#[test]
  fn success_create() {
    let rlp_list: RlpList<5> = create_rlp_list([fragments[0], fragments[1]]);

    assert_eq(rlp_list.len, 2);
    assert_eq(rlp_list.max_len(), 5);
}

#[test]
  fn modify_rlp_list() {
    let mut rlp_list: RlpList<5> = create_rlp_list([fragments[0], fragments[1]]);

    assert_eq(rlp_list.len, 2);

    rlp_list.push(fragments[2]);
    assert_eq(rlp_list.len, 3);

    let _ = rlp_list.pop();
    assert_eq(rlp_list.len, 2);
}

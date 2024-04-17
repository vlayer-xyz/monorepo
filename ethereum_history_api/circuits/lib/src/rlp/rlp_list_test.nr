use crate::rlp::rlp_list::{RlpList, create_rlp_list, FragmentWithDataType};
use crate::misc::fragment::Fragment;
use crate::rlp::decode::{LIST, STRING};

global fragments = [
    FragmentWithDataType { 
      fragment: Fragment {
        data: [1, 2, 3], 
        offset: 0, 
        length: 3
      }, 
      data_type: LIST
    },
    FragmentWithDataType { 
      fragment: Fragment {
        data: [4, 5, 6], 
        offset: 2, 
        length: 1
      }, 
      data_type: STRING
    },
    FragmentWithDataType { 
      fragment: Fragment {
        data: [7, 8, 9], 
        offset: 0, 
        length: 2
      }, 
      data_type: LIST
    }
];

#[test]
fn success_create() {
    let rlp_list: RlpList<3, 5> = create_rlp_list([fragments[0], fragments[1]]);

    assert_eq(rlp_list.len(), 2);
    assert_eq(rlp_list.max_len(), 5);
    assert_eq(rlp_list.get(1).fragment.data, [4, 5, 6]);
}

#[test]
fn modify_rlp_list() {
    let mut rlp_list: RlpList<3, 5> = create_rlp_list([fragments[0], fragments[1]]);

    assert_eq(rlp_list.len(), 2);

    rlp_list.push(fragments[2]);
    assert_eq(rlp_list.len(), 3);

    let _ = rlp_list.pop();
    assert_eq(rlp_list.len(), 2);
}

mod decode_list {
    use crate::rlp::rlp_list::{RlpList, decode_list};
    use crate::rlp::decode::STRING;

    #[test]
    fn empty() {
        let empty_list: RlpList<1, 3> = decode_list([0xc0]);
        assert_eq(empty_list.len(), 0);
    }

    #[test]
    fn three_elements() {
        let rlp = [0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0]; // ["0x636174","0x646f68","0x00"]

        let decoded: RlpList<10, 3> = decode_list(rlp);
        assert_eq(decoded.len(), 3);
        assert_eq(decoded.get(0).fragment.offset, 2);
        assert_eq(decoded.get(0).fragment.length, 3);
        assert_eq(decoded.get(0).fragment.data, rlp);
        assert_eq(decoded.get(0).data_type, STRING);
        assert_eq(decoded.get(1).fragment.offset, 6);
        assert_eq(decoded.get(1).fragment.length, 3);
        assert_eq(decoded.get(1).fragment.data, rlp);
        assert_eq(decoded.get(1).data_type, STRING);
        assert_eq(decoded.get(2).fragment.offset, 9);
        assert_eq(decoded.get(2).fragment.length, 1);
        assert_eq(decoded.get(2).fragment.data, rlp);
        assert_eq(decoded.get(2).data_type, STRING);
    }

    #[test(should_fail_with = "Expected a list")]
    fn fail_wrong_data_type() {
        let rlp_of_single_byte = [0x00];
        let _ : RlpList<1, 1> = decode_list(rlp_of_single_byte);
    }

    #[test(should_fail_with = "Decoded length of short list exceeds input length")]
    fn fail_length_exceeds_input_length() {
        let rlp = [0xc9, 0x13];
        let _ : RlpList<2, 10> = decode_list(rlp);
    }

    #[test(should_fail_with="Inconsistent rlp length")]
    fn fail_inconsistent_length() {
        let rlp = [0xc7, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x13];
        let _ : RlpList<10, 7> = decode_list(rlp);
    }
}

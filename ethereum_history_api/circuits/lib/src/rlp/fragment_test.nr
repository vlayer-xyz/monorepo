use crate::rlp::decode::{STRING, LIST};
use crate::rlp::fragment::RlpFragment;
use crate::misc::fragment::Fragment;

#[test]
 fn success_short() {
    let fragment = RlpFragment { fragment: Fragment { offset: 0, length: 1, data: [0; 5] }, data_type: STRING };
    let rlp = [0x42]; // "0x42"
    let value: [u8; 1] = [0x42];
    fragment.assert_string_eq("Field", rlp, BoundedVec { storage: value, len: value.len() })
}

#[test]
 fn success() {
    let fragment = RlpFragment { fragment: Fragment { offset: 1, length: 2, data: [0; 5] }, data_type: STRING };
    let rlp = [0x82, 0x12, 0x34]; // "0x1234"
    let value: [u8; 2] = [0x12, 0x34];
    fragment.assert_string_eq("Field", rlp, BoundedVec { storage: value, len: value.len() })
}
#[test(should_fail_with = "Field: Invalid RLP type")]
 fn invalid_type() {
    let invalid_type = LIST;
    let fragment = RlpFragment { fragment: Fragment { offset: 1, length: 0, data: [0; 5] }, data_type: invalid_type };
    let rlp = [0xc0]; // []
    let value: [u8; 0] = [];
    fragment.assert_string_eq("Field", rlp, BoundedVec { storage: value, len: value.len() })
}
#[test(should_fail_with = "Field: Invalid RLP length")]
 fn invalid_length() {
    let invalid_length = 1;
    let fragment = RlpFragment { fragment: Fragment { offset: 1, length: invalid_length, data: [0; 5] }, data_type: STRING };
    let rlp = [0x82, 0x12, 0x34]; // "0x1234"
    let value: [u8; 2] = [0x12, 0x34];
    fragment.assert_string_eq("Field", rlp, BoundedVec { storage: value, len: value.len() })
}

#[test(should_fail_with = "Field: Invalid RLP value")]
 fn invalid_value() {
    let fragment = RlpFragment { fragment: Fragment { offset: 1, length: 2, data: [0; 1] }, data_type: STRING };
    let rlp = [0x82, 0x12, 0x34]; // "0x1234"
    let invalid_value: [u8; 2] = [0x00, 0x00];
    fragment.assert_string_eq(
        "Field",
        rlp,
        BoundedVec { storage: invalid_value, len: invalid_value.len() }
    )
}

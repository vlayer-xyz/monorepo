mod rlp_fragment {
    mod assert_string_eq {
        use crate::rlp::{decode::{STRING, LIST}, types::RlpFragment};

        #[test]
        fn success_short() {
            let fragment = RlpFragment { offset: 0, length: 1, data_type: STRING };
            let rlp = [0x42]; // "0x42"
            let value: [u8; 1] = [0x42];
            fragment.assert_string_eq("Field", rlp, BoundedVec { storage: value, len: value.len() })
        }

        #[test]
        fn success() {
            let fragment = RlpFragment { offset: 1, length: 2, data_type: STRING };
            let rlp = [0x82, 0x12, 0x34]; // "0x1234"
            let value: [u8; 2] = [0x12, 0x34];
            fragment.assert_string_eq("Field", rlp, BoundedVec { storage: value, len: value.len() })
        }

        #[test(should_fail_with = "Field: Invalid RLP type")]
        fn invalid_type() {
            let invalid_type = LIST;
            let fragment = RlpFragment { offset: 1, length: 0, data_type: invalid_type };
            let rlp = [0xc0]; // []
            let value: [u8; 0] = [];
            fragment.assert_string_eq("Field", rlp, BoundedVec { storage: value, len: value.len() })
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let invalid_length = 1;
            let fragment = RlpFragment { offset: 1, length: invalid_length, data_type: STRING };
            let rlp = [0x82, 0x12, 0x34]; // "0x1234"
            let value: [u8; 2] = [0x12, 0x34];
            fragment.assert_string_eq("Field", rlp, BoundedVec { storage: value, len: value.len() })
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            let fragment = RlpFragment { offset: 1, length: 2, data_type: STRING };
            let rlp = [0x82, 0x12, 0x34]; // "0x1234"
            let invalid_value: [u8; 2] = [0x00, 0x00];
            fragment.assert_string_eq(
                "Field",
                rlp,
                BoundedVec { storage: invalid_value, len: invalid_value.len() }
            )
        }
    }

    mod assert_u64_eq {
        use crate::rlp::{decode::{STRING, LIST}, types::RlpFragment};

        #[test]
        fn success() {
            let fragment = RlpFragment { offset: 1, length: 2, data_type: STRING };
            let rlp = [0x82, 0x12, 0x34]; // "0x1234"
            let value = 0x1234;
            fragment.assert_u64_eq("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            let fragment = RlpFragment { offset: 1, length: 2, data_type: STRING };
            let rlp = [0x82, 0x12, 0x34]; // "0x1234"
            let invalid_value = 0x1235;
            fragment.assert_u64_eq("Field", rlp, invalid_value)
        }
    }
}

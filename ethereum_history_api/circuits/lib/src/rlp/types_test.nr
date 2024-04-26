mod rlp_fragment {
    mod assert_eq_bytes {
        use crate::rlp::{decode::{STRING, LIST}, types::RlpFragment};

        #[test]
        fn success_short() {
            let fragment = RlpFragment { offset: 0, length: 1, data_type: STRING };
            let rlp = [0x42]; // "0x42"
            let value: [u8; 1] = [0x42];
            fragment.assert_eq_bytes("Field", rlp, BoundedVec { storage: value, len: value.len() })
        }

        #[test]
        fn success() {
            let fragment = RlpFragment { offset: 1, length: 2, data_type: STRING };
            let rlp = [0x82, 0x12, 0x34]; // "0x1234"
            let value: [u8; 2] = [0x12, 0x34];
            fragment.assert_eq_bytes("Field", rlp, BoundedVec { storage: value, len: value.len() })
        }

        #[test(should_fail_with = "Field: Invalid RLP type")]
        fn invalid_type() {
            let invalid_type = LIST;
            let fragment = RlpFragment { offset: 1, length: 0, data_type: invalid_type };
            let rlp = [0xc0]; // []
            let value: [u8; 0] = [];
            fragment.assert_eq_bytes("Field", rlp, BoundedVec { storage: value, len: value.len() })
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let invalid_length = 1;
            let fragment = RlpFragment { offset: 1, length: invalid_length, data_type: STRING };
            let rlp = [0x82, 0x12, 0x34]; // "0x1234"
            let value: [u8; 2] = [0x12, 0x34];
            fragment.assert_eq_bytes("Field", rlp, BoundedVec { storage: value, len: value.len() })
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            let fragment = RlpFragment { offset: 1, length: 2, data_type: STRING };
            let rlp = [0x82, 0x12, 0x34]; // "0x1234"
            let invalid_value: [u8; 2] = [0x00, 0x00];
            fragment.assert_eq_bytes(
                "Field",
                rlp,
                BoundedVec { storage: invalid_value, len: invalid_value.len() }
            )
        }
    }

    mod assert_eq_bytes32 {
        use crate::rlp::{decode::STRING, types::RlpFragment};
        use crate::misc::types::Bytes32;
        use crate::misc::arrays::{resize_left, alter_array};

        #[test]
        fn success() {
            let value = [
                0x88, 0xe9, 0x6d, 0x45, 0x37, 0xbe, 0xa4, 0xd9, 0xc0, 0x5d, 0x12, 0x54, 0x99, 0x07, 0xb3, 0x25, 0x61, 0xd3, 0xbf, 0x31, 0xf4, 0x5a, 0xae, 0x73, 0x4c, 0xdc, 0x11, 0x9f, 0x13, 0x40, 0x6c, 0xb6
            ];

            let mut rlp: [u8; 33] = resize_left(value);
            rlp[0] = 0xa0; // 0x80 + 32
            let fragment = RlpFragment { offset: 1, length: 32, data_type: STRING };

            fragment.assert_eq_bytes32("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let value = [
                0x88, 0xe9, 0x6d, 0x45, 0x37, 0xbe, 0xa4, 0xd9, 0xc0, 0x5d, 0x12, 0x54, 0x99, 0x07, 0xb3, 0x25, 0x61, 0xd3, 0xbf, 0x31, 0xf4, 0x5a, 0xae, 0x73, 0x4c, 0xdc, 0x11, 0x9f, 0x13, 0x40, 0x6c, 0xb6
            ];

            let mut rlp: [u8; 33] = resize_left(value);
            rlp[0] = 0xa0; // 0x80 + 32
            let invalid_length = 2;
            let fragment = RlpFragment { offset: 1, length: invalid_length, data_type: STRING };

            fragment.assert_eq_bytes32("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            let value = [
                0x88, 0xe9, 0x6d, 0x45, 0x37, 0xbe, 0xa4, 0xd9, 0xc0, 0x5d, 0x12, 0x54, 0x99, 0x07, 0xb3, 0x25, 0x61, 0xd3, 0xbf, 0x31, 0xf4, 0x5a, 0xae, 0x73, 0x4c, 0xdc, 0x11, 0x9f, 0x13, 0x40, 0x6c, 0xb6
            ];

            let mut rlp: [u8; 33] = resize_left(value);
            rlp[0] = 0xa0; // 0x80 + 32
            let fragment = RlpFragment { offset: 1, length: 32, data_type: STRING };

            fragment.assert_eq_bytes32("Field", rlp, alter_array(value))
        }
    }

    mod assert_eq_address {
        use crate::rlp::{decode::STRING, types::RlpFragment};
        use crate::misc::types::Address;
        use crate::misc::arrays::{resize_left, alter_array};

        #[test]
        fn success() {
            let value = [
                0xd8, 0xda, 0x6b, 0xf2, 0x69, 0x64, 0xaf, 0x9d, 0x7e, 0xed, 0x9e, 0x03, 0xe5, 0x34, 0x15, 0xd3, 0x7a, 0xa9, 0x60, 0x45
            ];

            let mut rlp: [u8; 21] = resize_left(value);
            rlp[0] = 0x94; // 0x80 + 20
            let fragment = RlpFragment { offset: 1, length: 20, data_type: STRING };

            fragment.assert_eq_address("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let value = [
                0xd8, 0xda, 0x6b, 0xf2, 0x69, 0x64, 0xaf, 0x9d, 0x7e, 0xed, 0x9e, 0x03, 0xe5, 0x34, 0x15, 0xd3, 0x7a, 0xa9, 0x60, 0x45
            ];

            let mut rlp: [u8; 21] = resize_left(value);
            rlp[0] = 0x94; // 0x80 + 20
            let invalid_length = 2;
            let fragment = RlpFragment { offset: 1, length: invalid_length, data_type: STRING };

            fragment.assert_eq_address("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            let value = [
                0xd8, 0xda, 0x6b, 0xf2, 0x69, 0x64, 0xaf, 0x9d, 0x7e, 0xed, 0x9e, 0x03, 0xe5, 0x34, 0x15, 0xd3, 0x7a, 0xa9, 0x60, 0x45
            ];

            let mut rlp: [u8; 21] = resize_left(value);
            rlp[0] = 0x94; // 0x80 + 20
            let fragment = RlpFragment { offset: 1, length: 20, data_type: STRING };

            fragment.assert_eq_address("Field", rlp, alter_array(value))
        }
    }
}

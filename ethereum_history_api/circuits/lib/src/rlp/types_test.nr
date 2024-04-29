mod rlp_fragment {
    mod assert_eq_bytes_length {
        use crate::rlp::{decode::{STRING, LIST}, types::RlpFragment};

        global bytes = [0x12, 0x34];
        global fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };

        #[test]
        fn success() {
            let rlp = [0x80];
            let value = [0x80];
            let fragment = RlpFragment { offset: 0, length: 1, data_type: STRING };

            fragment.assert_eq_bytes_length("Field", rlp, value, 1)
        }

        #[test(should_fail_with = "Field: Invalid RLP type")]
        fn invalid_type() {
            let empty = [];
            let invalid_type_fragment = RlpFragment { offset: 0, length: 0, data_type: LIST };

            invalid_type_fragment.assert_eq_bytes_length("Field", empty, empty, 0)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let invalid_length_fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };

            invalid_length_fragment.assert_eq_bytes_length("Field", bytes, bytes, 1)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            let invalid_value: [u8; 2] = [0x00, 0x00];

            fragment.assert_eq_bytes_length("Field", bytes, invalid_value, 2)
        }
    }

    mod assert_eq_bounded_vec {
        use crate::rlp::{decode::{STRING, LIST}, types::RlpFragment};

        global bytes = [0x12, 0x34];
        global fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };

        #[test]
        fn success_short() {
            let fragment = RlpFragment { offset: 0, length: 1, data_type: STRING };
            let byte = [0x42];

            fragment.assert_eq_bounded_vec("Field", byte, BoundedVec { storage: byte, len: 1 })
        }

        #[test]
        fn success() {
            fragment.assert_eq_bounded_vec(
                "Field",
                bytes,
                BoundedVec { storage: bytes, len: bytes.len() }
            )
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let invalid_length_fragment = RlpFragment { offset: 0, length: 1, data_type: STRING };

            invalid_length_fragment.assert_eq_bounded_vec(
                "Field",
                bytes,
                BoundedVec { storage: bytes, len: bytes.len() }
            )
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            let invalid_value: [u8; 2] = [0x00, 0x00];

            fragment.assert_eq_bounded_vec(
                "Field",
                bytes,
                BoundedVec { storage: invalid_value, len: invalid_value.len() }
            )
        }
    }

    mod assert_eq_u64 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global rlp = [0x69, 0x1f]; // "0x691f"
        global value = 26911;
        global fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };

        #[test]
        fn success() {
            fragment.assert_eq_u64("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
         fn invalid_length() {
            fragment.assert_eq_u64("Field", rlp, 0x123456)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
         fn invalid_value() {
            fragment.assert_eq_u64("Field", rlp, 0x1235)
        }
    }

    mod assert_eq_bytes32 {
        use crate::rlp::{decode::STRING, types::RlpFragment};
        use crate::misc::types::Bytes32;
        use crate::misc::arrays::alter_array;

        global bytes = [
            0x88, 0xe9, 0x6d, 0x45, 0x37, 0xbe, 0xa4, 0xd9, 0xc0, 0x5d, 0x12, 0x54, 0x99, 0x07, 0xb3, 0x25, 0x61, 0xd3, 0xbf, 0x31, 0xf4, 0x5a, 0xae, 0x73, 0x4c, 0xdc, 0x11, 0x9f, 0x13, 0x40, 0x6c, 0xb6
        ];

        global fragment = RlpFragment { offset: 0, length: 32, data_type: STRING };

        #[test]
        fn success() {
            fragment.assert_eq_bytes32("Field", bytes, bytes)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let invalid_length_fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };

            invalid_length_fragment.assert_eq_bytes32("Field", bytes, bytes)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_bytes32("Field", bytes, alter_array(bytes))
        }
    }

    mod assert_eq_address {
        use crate::rlp::{decode::STRING, types::RlpFragment};
        use crate::misc::types::Address;
        use crate::misc::arrays::alter_array;

        global address = [
            0xd8, 0xda, 0x6b, 0xf2, 0x69, 0x64, 0xaf, 0x9d, 0x7e, 0xed, 0x9e, 0x03, 0xe5, 0x34, 0x15, 0xd3, 0x7a, 0xa9, 0x60, 0x45
        ];

        global fragment = RlpFragment { offset: 0, length: 20, data_type: STRING };

        #[test]
        fn success() {
            fragment.assert_eq_address("Field", address, address)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let invalid_length_fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };

            invalid_length_fragment.assert_eq_address("Field", address, address)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_address("Field", address, alter_array(address))
        }
    }

    mod assert_eq_u1 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global byte = 1;
        global rlp = [0x01];
        global fragment = RlpFragment { offset: 0, length: 1, data_type: STRING };

        #[test]
        fn succes() {
            fragment.assert_eq_u1("Field", rlp, byte)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let rlp = [0x01, 0x01];
            let fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };

            fragment.assert_eq_u1("Field", rlp, byte)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            let invalid_value = 0;

            fragment.assert_eq_u1("Field", rlp, invalid_value)
        }
    }

    mod assert_eq_u32 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global rlp = [0x56, 0xd0];
        global fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };
        global value = 22224;

        #[test]
        fn success() {
            fragment.assert_eq_u32("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            fragment.assert_eq_u32("Field", rlp, 0x56d011)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_u32("Field", rlp, 0x1234)
        }
    }
}

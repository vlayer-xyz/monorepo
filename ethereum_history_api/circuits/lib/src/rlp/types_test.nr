mod rlp_fragment {
    mod assert_eq_bytes_length {
        use crate::rlp::{decode::{STRING, LIST}, types::RlpFragment};

        global bytes = [0x12, 0x34];
        global fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };

        #[test]
        fn success() {
            fragment.assert_eq_bytes_length("Field", bytes, bytes, 2)
        }

        #[test(should_fail_with = "Field: Invalid RLP type")]
        fn invalid_type() {
            let empty = [];
            let invalid_type_fragment = RlpFragment { offset: 0, length: 0, data_type: LIST };

            invalid_type_fragment.assert_eq_bytes_length("Field", empty, empty, 0)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let invalid_length_fragment = RlpFragment { offset: 0, length: 3, data_type: STRING };

            invalid_length_fragment.assert_eq_bytes_length("Field", bytes, bytes, 2)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length_given() {
            fragment.assert_eq_bytes_length("Field", bytes, bytes, 3)
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

    mod assert_eq_null {
        use crate::rlp::{decode::{STRING, LIST}, types::RlpFragment};
        #[test]
        fn success() {
            let fragment = RlpFragment { offset: 0, length: 0, data_type: STRING };

            fragment.assert_eq_null("Field")
        }

        #[test(should_fail_with = "Field: Invalid RLP type")]
        fn invalid_type() {
            let invalid_type_fragment = RlpFragment { offset: 0, length: 0, data_type: LIST };

            invalid_type_fragment.assert_eq_null("Field")
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let invalid_length_fragment = RlpFragment { offset: 0, length: 1, data_type: STRING };

            invalid_length_fragment.assert_eq_null("Field")
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
            let invalid_length_fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };

            invalid_length_fragment.assert_eq_u1("Field", rlp, byte)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_u1("Field", rlp, 0)
        }
    }

    mod assert_eq_u8 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global rlp = [0x11];
        global fragment = RlpFragment { offset: 0, length: 1, data_type: STRING };
        global value = 17;

        #[test]
        fn success() {
            fragment.assert_eq_u8("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let rlp = [0x01, 0x01];
            let invalid_length_fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };

            invalid_length_fragment.assert_eq_u8("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_u8("Field", rlp, 16)
        }
    }

    mod assert_eq_u32 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global rlp = [0xEE, 0x6B, 0x28, 0x00]; //4000000000
        global fragment = RlpFragment { offset: 0, length: 4, data_type: STRING };
        global value = 4000000000;

        #[test]
        fn success() {
            fragment.assert_eq_u32("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            fragment.assert_eq_u32("Field", rlp, 0xEE6B28)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_u32("Field", rlp, 0x12345678)
        }
    }

    mod assert_eq_u64 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global rlp = [0x8A, 0xC7, 0x23, 0x04, 0x89, 0xE8, 0x00, 0x00];
        global fragment = RlpFragment { offset: 0, length: 8, data_type: STRING };
        global value = 10000000000000000000;

        #[test]
        fn success() {
            fragment.assert_eq_u64("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
         fn invalid_length() {
            fragment.assert_eq_u64("Field", rlp, 0x8AC723)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
         fn invalid_value() {
            fragment.assert_eq_u64("Field", rlp, 0x123567812345678)
        }
    }

    mod assert_eq_u128 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global rlp = [0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa];
        global fragment = RlpFragment { offset: 0, length: 16, data_type: STRING };
        global value = U128::from_integer(226854911280625642308916404954512140970);

        #[test]
        fn success() {
            fragment.assert_eq_u128("Field", rlp, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            fragment.assert_eq_u128("Field", rlp, U128::from_integer(100000))
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_u128(
                "Field",
                rlp,
                U128::from_integer(100000000000000000000000000000000000000)
            )
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
}

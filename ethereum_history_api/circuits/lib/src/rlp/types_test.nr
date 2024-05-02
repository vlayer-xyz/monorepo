mod rlp_fragment {
    mod assert_eq_bytes {
        use crate::rlp::{decode::{STRING, LIST}, types::RlpFragment};
        use crate::misc::arrays::alter_array;

        global fragment = RlpFragment { offset: 0, length, data_type: STRING };
        global encoded_bytes = [0x12, 0x34];
        global bytes = encoded_bytes;
        global length = bytes.len();

        #[test]
        fn success() {
            fragment.assert_eq_bytes("Field", encoded_bytes, bytes, length)
        }

        #[test(should_fail_with = "Field: Invalid RLP type")]
        fn invalid_type() {
            let mut invalid_type_fragment = fragment;
            invalid_type_fragment.data_type = LIST;

            invalid_type_fragment.assert_eq_bytes("Field", encoded_bytes, bytes, length)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let mut invalid_length_fragment = fragment;
            invalid_length_fragment.length = length + 1;

            invalid_length_fragment.assert_eq_bytes("Field", encoded_bytes, bytes, length)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length_given() {
            fragment.assert_eq_bytes("Field", encoded_bytes, bytes, length + 1)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_bytes("Field", encoded_bytes, alter_array(bytes), length)
        }
    }

    mod assert_eq_bounded_vec {
        use crate::rlp::{decode::{STRING, LIST}, types::RlpFragment};
        use crate::misc::arrays::alter_array;

        global fragment = RlpFragment { offset: 0, length: 2, data_type: STRING };
        global encoded_bytes = [0x12, 0x34];
        global bounded_vec = BoundedVec { storage: encoded_bytes, len: encoded_bytes.len() };

        #[test]
        fn success_short() {
            let short_fragment = RlpFragment { offset: 0, length: 1, data_type: STRING };
            let short_bounded_vec = BoundedVec { storage: encoded_bytes, len: 1 };

            short_fragment.assert_eq_bounded_vec("Field", encoded_bytes, short_bounded_vec)
        }

        #[test]
        fn success() {
            fragment.assert_eq_bounded_vec("Field", encoded_bytes, bounded_vec)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let mut invalid_length_fragment = fragment;
            invalid_length_fragment.length = 1;

            invalid_length_fragment.assert_eq_bounded_vec("Field", encoded_bytes, bounded_vec)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            let mut invalid_value_bounded_vec = bounded_vec;
            invalid_value_bounded_vec.storage = alter_array(encoded_bytes);

            fragment.assert_eq_bounded_vec("Field", encoded_bytes, invalid_value_bounded_vec)
        }
    }

    mod assert_empty_string {
        use crate::rlp::{decode::{STRING, LIST}, types::RlpFragment};

        global fragment = RlpFragment { offset: 0, length: 0, data_type: STRING };

        #[test]
        fn success() {
            fragment.assert_empty_string("Field")
        }

        #[test(should_fail_with = "Field: Invalid RLP type")]
        fn invalid_type() {
            let mut invalid_type_fragment = fragment;
            invalid_type_fragment.data_type = LIST;

            invalid_type_fragment.assert_empty_string("Field")
        }

        #[test(should_fail_with = "Field: Expected empty string")]
        fn invalid_length() {
            let mut invalid_length_fragment = fragment;
            invalid_length_fragment.length = 1;

            invalid_length_fragment.assert_empty_string("Field")
        }
    }

    mod assert_eq_u1 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global fragment = RlpFragment { offset: 0, length: 1, data_type: STRING };
        global encoded_value = [0x01];
        global bit_value: u1 = 0x01;

        #[test]
        fn succes() {
            fragment.assert_eq_u1("Field", encoded_value, bit_value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let invalid_length_encoded_value = [0x01, 0x01];
            let mut invalid_length_fragment = fragment;
            invalid_length_fragment.length = 2;

            invalid_length_fragment.assert_eq_u1("Field", invalid_length_encoded_value, bit_value)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_u1("Field", encoded_value, bit_value - 1)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value_exceeding_bit() {
            let invalid_over_bit_encoded_value = [0x11];
            fragment.assert_eq_u1("Field", invalid_over_bit_encoded_value, bit_value)
        }
    }

    mod assert_eq_u8 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global fragment = RlpFragment { offset: 0, length: 1, data_type: STRING };
        global encoded_value = [0x10];
        global value = 0x10;

        #[test]
        fn success() {
            fragment.assert_eq_u8("Field", encoded_value, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let invalid_length_encoded_value = [0x10, 0x00];
            let mut invalid_length_fragment = fragment;
            invalid_length_fragment.length = 2;

            invalid_length_fragment.assert_eq_u8("Field", invalid_length_encoded_value, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_u8("Field", encoded_value, value + 1)
        }
    }

    mod assert_eq_u32 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global fragment = RlpFragment { offset: 0, length: 4, data_type: STRING };
        global encoded_value = [0x10, 0x00, 0x00, 0x00];
        global value = 0x10000000;

        #[test]
        fn success() {
            fragment.assert_eq_u32("Field", encoded_value, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let short_value = 0x10;
            fragment.assert_eq_u32("Field", encoded_value, short_value)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_u32("Field", encoded_value, value + 1)
        }
    }

    mod assert_eq_u64 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global fragment = RlpFragment { offset: 0, length: 8, data_type: STRING };
        global encoded_value = [0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
        global value = 0x1000000000000000;

        #[test]
        fn success() {
            fragment.assert_eq_u64("Field", encoded_value, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
         fn invalid_length() {
            let short_value = 0x10;
            fragment.assert_eq_u64("Field", encoded_value, short_value)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
         fn invalid_value() {
            fragment.assert_eq_u64("Field", encoded_value, value + 1)
        }
    }

    mod assert_eq_u128 {
        use crate::rlp::{decode::STRING, types::RlpFragment};

        global fragment = RlpFragment { offset: 0, length: 16, data_type: STRING };
        global encoded_value = [0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
        global value = U128::from_integer(0x10000000000000000000000000000000);

        #[test]
        fn success() {
            fragment.assert_eq_u128("Field", encoded_value, value)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let short_value = U128::from_integer(0x10);
            fragment.assert_eq_u128("Field", encoded_value, short_value)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_u128("Field", encoded_value, value + U128::from_integer(1))
        }
    }

    mod assert_eq_address {
        use crate::rlp::{decode::STRING, types::RlpFragment};
        use crate::misc::types::Address;
        use crate::misc::arrays::alter_array;

        global fragment = RlpFragment { offset: 0, length: 20, data_type: STRING };
        global address = [
            0xd8, 0xda, 0x6b, 0xf2, 0x69, 0x64, 0xaf, 0x9d, 0x7e, 0xed, 0x9e, 0x03, 0xe5, 0x34, 0x15, 0xd3, 0x7a, 0xa9, 0x60, 0x45
        ];

        #[test]
        fn success() {
            fragment.assert_eq_address("Field", address, address)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let mut invalid_length_fragment = fragment;
            invalid_length_fragment.length = 2;

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

        global fragment = RlpFragment { offset: 0, length: 32, data_type: STRING };
        global bytes = [
            0x88, 0xe9, 0x6d, 0x45, 0x37, 0xbe, 0xa4, 0xd9, 0xc0, 0x5d, 0x12, 0x54, 0x99, 0x07, 0xb3, 0x25, 0x61, 0xd3, 0xbf, 0x31, 0xf4, 0x5a, 0xae, 0x73, 0x4c, 0xdc, 0x11, 0x9f, 0x13, 0x40, 0x6c, 0xb6
        ];

        #[test]
        fn success() {
            fragment.assert_eq_bytes32("Field", bytes, bytes)
        }

        #[test(should_fail_with = "Field: Invalid RLP length")]
        fn invalid_length() {
            let mut invalid_length_fragment = fragment;
            invalid_length_fragment.length = 2;

            invalid_length_fragment.assert_eq_bytes32("Field", bytes, bytes)
        }

        #[test(should_fail_with = "Field: Invalid RLP value")]
        fn invalid_value() {
            fragment.assert_eq_bytes32("Field", bytes, alter_array(bytes))
        }
    }
}

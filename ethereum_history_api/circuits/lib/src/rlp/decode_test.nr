use crate::rlp::decode::copy_subfragment;
use crate::misc::fragment::Fragment;

#[test]
fn test_copy_subfragment() {
    let input = Fragment::new_focused([1, 2, 3, 4, 5]);
    assert(copy_subfragment(input, 0) == Fragment::new_focused([1, 2, 3, 4, 5]));
    assert(copy_subfragment(input, 2) == Fragment::new_focused([3, 4, 5]));
    assert(copy_subfragment(input, 5) == Fragment::new_focused([]));
    assert(copy_subfragment(input, 6) == Fragment::new_focused([]));
}

mod extract_payload_len {
    use crate::rlp::decode::extract_payload_len;
    use crate::misc::{arrays::resize, fragment::Fragment};

    #[test] 
    fn unpadded() {
        let mut rlp_header = Fragment::new_focused([0xf9, 1, 1]);
        let lenlen = (rlp_header.pop_front() - 0xf7) as u64;
        assert(extract_payload_len(rlp_header, lenlen) == 0x0101);
    }

    #[test]
    fn padded() {
        let rlp_header = [249, 1, 1];
        let mut rlp_header_padded : Fragment<200, u8> = Fragment::new_focused(resize(rlp_header));
        let lenlen = (rlp_header_padded.pop_front() - 0xf7) as u64;
        assert(extract_payload_len(rlp_header_padded, lenlen) == 0x0101);
    }

    #[test(should_fail_with = "Length of length exceeds maximum")]
    fn fail_lenlen_exceeding() {
        let _ = extract_payload_len(Fragment::new_focused([9, 5, 4, 5, 3, 5, 3]), 3);
    }

    #[test(should_fail_with = "Length of length is zero")]
    fn fail_lenlen_zero() {
        let _ = extract_payload_len(Fragment::new_focused([0, 0, 0]), 0);
    }

    #[test(should_fail_with ="Length of length exceeds input length")]
    fn lenlen_exceeds_input_length() {
        let rlp_header = Fragment::new_focused([3]);
        let lenlen = 2;
        let _ = extract_payload_len(rlp_header, lenlen);
    }

    #[test(should_fail)] // It doesn't compile because the loop bound is negative
    fn empty_array() {
        let rlp_header = Fragment::empty();
        let lenlen = 0;
        let _ = extract_payload_len(rlp_header, lenlen);
    }
}

mod decode_string {
    use crate::rlp::decode::decode_string;
    use crate::misc::{arrays::resize, fragment::Fragment};

    #[test]
    fn one_byte_zero() {
        let rlp = Fragment::new_focused([0x00]);
        let expected_offset = 0;
        let expected_length = 1;
        assert(decode_string(rlp) == (expected_offset, expected_length));
    }

    #[test]
    fn one_byte_one() {
        let rlp = Fragment::new_focused([0x01]);
        let expected_offset = 0;
        let expected_length = 1;
        assert(decode_string(rlp) == (expected_offset, expected_length));
    }

    #[test]
    fn three_bytes() {
        let rlp = Fragment::new_focused([0x83, 0x63, 0x61, 0x74]); // "0x636174"
        let expected_offset = 1;
        let expected_length = 3;
        assert(decode_string(rlp) == (expected_offset, expected_length));
    }

    #[test]
    fn using_lenlen() {
        let rlp_header = [0xb8, 60]; //string of length 60
        let rlp : Fragment<62, u8> = Fragment::new_focused(resize(rlp_header));
        let expected_offset = 2;
        let expected_length = 60;
        assert(decode_string(rlp) == (expected_offset, expected_length));
    }

    #[test(should_fail_with = "Wrong data type")]
    fn fail_list_type() {
        let rlp_of_list_type = Fragment::new_focused([0xc0]); // []
        let _ = decode_string(rlp_of_list_type);
    }

    #[test(should_fail_with = "Decoded length of short string exceeds input length")]
    fn fail_length_exceeds_input_length() {
        let rlp_with_wrong_length = Fragment::new_focused([0x89]); // length is 9, but 0 bytes of payload is provided
        let _ = decode_string(rlp_with_wrong_length);
    }
}

mod decode_list {
    use crate::rlp::{decode::{decode_list, RlpList, STRING}, types::RlpFragment};
    use crate::misc::{bounded_vecs::bounded_vec_from_array, fragment::Fragment};

    #[test]
    fn empty() {
        let empty_list: RlpList<1> = decode_list(Fragment::new_focused([0xc0]));
        assert(empty_list.len == 0);
    }

    #[test]
    fn three_elements() {
        let rlp = Fragment::new_focused([0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0]); // ["0x636174","0x646f68","0x00"]
        let expected: RlpList<10> = bounded_vec_from_array(
            [
            RlpFragment { offset: 2, length: 3, data_type: STRING },
            RlpFragment { offset: 6, length: 3, data_type: STRING },
            RlpFragment { offset: 9, length: 1, data_type: STRING }
        ]
        );
        let decoded = decode_list(rlp);
        assert_eq(decoded.len, expected.len);
        assert_eq(decoded.storage(), expected.storage());
    }

    #[test(should_fail_with = "Expected a list")]
    fn fail_wrong_data_type() {
        let rlp_of_single_byte = Fragment::new_focused([0x00]);
        let _ : RlpList<1> = decode_list(rlp_of_single_byte);
    }

    #[test(should_fail_with = "Decoded length of short list exceeds input length")]
    fn fail_length_exceeds_input_length() {
        let rlp = Fragment::new_focused([0xc9, 0x13]);
        let _ : RlpList<1> = decode_list(rlp);
    }

    #[test(should_fail_with="Inconsistent rlp length")]
    fn fail_inconsistent_length() {
        let rlp = Fragment::new_focused([0xc7, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x13]);
        let _ : RlpList<3> = decode_list(rlp);
    }
}

mod decode_list_of_small_strings {
    use crate::rlp::decode::{decode_list_of_small_strings, RlpList, RlpFragment, STRING};
    use crate::misc::{bounded_vecs::bounded_vec_from_array, fragment::Fragment};

    #[test]
    fn success_empty_list() {
        let rlp = Fragment::new_focused([0xc0]);
        let expected: RlpList<10> = bounded_vec_from_array([]);

        let decoded = decode_list_of_small_strings(rlp);
        assert_eq(decoded.len, expected.len);
        assert_eq(decoded.storage(), expected.storage());
    }

    #[test]
    fn success() {
        let rlp = Fragment::new_focused([0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x13]); //["0x636174","0x646f68","0x13"]
        let expected: RlpList<10> = bounded_vec_from_array(
            [
            RlpFragment { offset: 2, length: 3, data_type: STRING },
            RlpFragment { offset: 6, length: 3, data_type: STRING },
            RlpFragment { offset: 9, length: 1, data_type: STRING }
        ]
        );

        let decoded = decode_list_of_small_strings(rlp);
        assert_eq(decoded.len, expected.len);
        assert_eq(decoded.storage(), expected.storage());
    }

    #[test(should_fail_with="Inconsistent rlp length")]
    fn fail_inconsistent_length() {
        let rlp = Fragment::new_focused([0xc7, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x13]);
        let _ : RlpList<3> = decode_list_of_small_strings(rlp);
    }

    #[test(should_fail_with = "Expected a list")]
    fn fail_wrong_data_type() {
        let rlp_of_single_byte = Fragment::new_focused([0x00]);
        let _ : RlpList<1> = decode_list_of_small_strings(rlp_of_single_byte);
    }

    #[test(should_fail_with = "Decoded length of short list exceeds input length")]
    fn fail_length_exceeds_input_length() {
        let rlp = Fragment::new_focused([0xc9, 0x13]);
        let _ : RlpList<1> = decode_list_of_small_strings(rlp);
    }

    #[test(should_fail_with = "Element is not a string of length < 56 bytes")]
    fn fail_list_with_lists() {
        let rlp = Fragment::new_focused([0xc1, 0xc0]);
        let _ : RlpList<1> = decode_list_of_small_strings(rlp);
    }
}

mod get_small_string_offset_and_length {
    use crate::rlp::decode::get_small_string_offset_and_length;

    #[test]
    fn success_short_string() {
        let header_byte = 0x83;
        let (expected_offset, expected_length) = (1, 3);

        assert(get_small_string_offset_and_length(header_byte) == (expected_offset, expected_length));
    }

    #[test]
    fn success_byte() {
        let header_byte = 0x11;
        let (expected_offset, expected_length) = (0, 1);

        assert(get_small_string_offset_and_length(header_byte) == (expected_offset, expected_length));
    }

    #[test(should_fail_with = "Element is not a string of length < 56 bytes")]
    fn fail_list_type() {
        let header_of_list_type = 0xc0;
        let _ = get_small_string_offset_and_length(header_of_list_type);
    }

    #[test(should_fail_with = "Element is not a string of length < 56 bytes")]
    fn fail_long_string_type() {
        let header_of_list_type = 0xb9;
        let _ = get_small_string_offset_and_length(header_of_list_type);
    }
}

mod decode_to_rlp_header {
    use crate::rlp::decode::{decode_to_rlp_header, RlpHeader, STRING, LIST};
    use crate::misc::{arrays::resize, fragment::Fragment};

    #[test]
    fn success_single_byte() {
        let rlp = Fragment::new_focused([0x00]); // "0x00"
        let expected = RlpHeader { offset: 0, length: 1, data_type: STRING };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_short_string() {
        let rlp = Fragment::new_focused([0x83, 0x63, 0x61, 0x74]); // "0x636174"
        let expected = RlpHeader { offset: 1, length: 3, data_type: STRING };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_long_string() {
        let header = [0xb8, 60]; // string with 60 bytes
        let rlp : Fragment<62, u8> = Fragment::new_focused(resize(header));
        let expected = RlpHeader { offset: 2, length: 60, data_type: STRING };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_empty_list() {
        let rlp = Fragment::new_focused([0xc0]); // []
        let expected = RlpHeader { offset: 1, length: 0, data_type: LIST };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_short_list() {
        let rlp = Fragment::new_focused([0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x18]); // ["0x636174", "0x646f68", "0x18"]
        let expected = RlpHeader { offset: 1, length: 9, data_type: LIST };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_short_list_with_lists() {
        let rlp = Fragment::new_focused([0xc8, 0xc0, 0xc1, 0xc0, 0xc3, 0xc0, 0xc1, 0xc0, 0xc0]); // [[], [[]], [[], [[]], []]
        let expected = RlpHeader { offset: 1, length: 8, data_type: LIST };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_long_list() {
        let header = [0xf8, 60]; // list of 60 elements
        let rlp : Fragment<62, u8> = Fragment::new_focused(resize(header));
        let expected = RlpHeader { offset: 2, length: 60, data_type: LIST };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test(should_fail_with = "Decoded length of short string exceeds input length")]
    fn fail_wrong_short_string_rlp() {
        let rlp = Fragment::new_focused([0x81]);
        let _ = decode_to_rlp_header(rlp);
    }

    #[test(should_fail_with = "Decoded length of long string exceeds input length")]
    fn fail_wrong_long_string_rlp() {
        let rlp = Fragment::new_focused([0xb8, 60]);
        let _ = decode_to_rlp_header(rlp);
    }

    #[test(should_fail_with = ""Decoded length of short list exceeds input length")]
    fn fail_wrong_short_list_rlp() {
        let rlp = Fragment::new_focused([0xc1]);
        let _ = decode_to_rlp_header(rlp);
    }

    #[test(should_fail_with = ""Decoded length of long list exceeds input length")]
    fn fail_wrong_long_list_rlp() {
        let rlp = Fragment::new_focused([0xf8, 60]);
        let _ = decode_to_rlp_header(rlp);
    }
}

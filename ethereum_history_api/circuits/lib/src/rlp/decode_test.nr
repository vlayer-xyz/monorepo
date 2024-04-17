use crate::rlp::decode::copy_subarray;

#[test]
fn test_copy_subarray() {
    let input = [1, 2, 3, 4, 5];
    assert(copy_subarray(input, 0) == [1, 2, 3, 4, 5]);
    assert(copy_subarray(input, 2) == [3, 4, 5]);
    assert(copy_subarray(input, 5) == []);
    assert(copy_subarray(input, 6) == []);
}

mod extract_payload_len {
    use crate::rlp::decode::extract_payload_len;
    use crate::misc::arrays::resize;

    #[test] 
    fn unpadded() {
        let rlp_header = [0xf9, 1, 1];
        let lenlen = (rlp_header[0] - 0xf7) as u64;
        assert(extract_payload_len(rlp_header, lenlen) == 0x0101);
    }

    #[test]
    fn padded() {
        let rlp_header = [249, 1, 1];
        let rlp_header_padded : [u8; 200] = resize(rlp_header);
        let lenlen = (rlp_header_padded[0] - 0xf7) as u64;
        assert(extract_payload_len(rlp_header_padded, lenlen) == 0x0101);
    }

    #[test(should_fail_with = "Length of length exceeds maximum")]
    fn fail_lenlen_exceeding() {
        let _ = extract_payload_len([9], 3);
    }

    #[test(should_fail_with = "Length of length is zero")]
    fn fail_lenlen_zero() {
        let _ = extract_payload_len([0, 0, 0], 0);
    }

    #[test(should_fail_with ="Length of length exceeds input length")]
    fn lenlen_exceeds_input_length() {
        let rlp_header = [3];
        let lenlen = 2;
        let _ = extract_payload_len(rlp_header, lenlen);
    }

    #[test(should_fail)] // It doesn't compile because the loop bound is negative
    fn empty_array() {
        let rlp_header = [];
        let lenlen = 0;
        let _ = extract_payload_len(rlp_header, lenlen);
    }
}

mod decode_string {
    use crate::rlp::decode::decode_string;
    use crate::misc::arrays::resize;

    #[test]
    fn one_byte_zero() {
        let rlp = [0x00];
        let expected_offset = 0;
        let expected_length = 1;
        assert(decode_string(rlp) == (expected_offset, expected_length));
    }

    #[test]
    fn one_byte_one() {
        let rlp = [0x01];
        let expected_offset = 0;
        let expected_length = 1;
        assert(decode_string(rlp) == (expected_offset, expected_length));
    }

    #[test]
    fn three_bytes() {
        let rlp = [0x83, 0x63, 0x61, 0x74]; // "0x636174"
        let expected_offset = 1;
        let expected_length = 3;
        assert(decode_string(rlp) == (expected_offset, expected_length));
    }

    #[test]
    fn using_lenlen() {
        let rlp_header = [0xb8, 60]; //string of length 60
        let rlp : [u8; 62]= resize(rlp_header);
        let expected_offset = 2;
        let expected_length = 60;
        assert(decode_string(rlp) == (expected_offset, expected_length));
    }

    #[test(should_fail_with = "Wrong data type")]
    fn fail_list_type() {
        let rlp_of_list_type = [0xc0]; // []
        let _ = decode_string(rlp_of_list_type);
    }

    #[test(should_fail_with = "Decoded length of short string exceeds input length")]
    fn fail_length_exceeds_input_length() {
        let rlp_with_wrong_length = [0x89]; // length is 9, but 0 bytes of payload is provided
        let _ = decode_string(rlp_with_wrong_length);
    }
}

mod decode_list {
    use crate::rlp::decode::{decode_list, RlpList, STRING, RlpFragment};

    #[test]
    fn empty() {
        let empty_list: RlpList<1> = decode_list([0xc0]);
        assert(empty_list.num_fields == 0);
    }

    #[test]
    fn three_elements() {
        let rlp = [0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0]; // ["0x636174","0x646f68","0x00"]
        let expected = RlpList {
            fragments: [
                RlpFragment { offset: 2, length: 3, data_type: STRING },
                RlpFragment { offset: 6, length: 3, data_type: STRING },
                RlpFragment { offset: 9, length: 1, data_type: STRING },
                RlpFragment { offset: 0, length: 0, data_type: STRING }
            ],
            num_fields: 3
        };
        assert(decode_list(rlp) == expected);
    }

    #[test(should_fail_with = "Expected a list")]
    fn fail_wrong_data_type() {
        let rlp_of_single_byte = [0x00];
        let _ : RlpList<1> = decode_list(rlp_of_single_byte);
    }

    #[test(should_fail_with = "Decoded length of short list exceeds input length")]
    fn fail_length_exceeds_input_length() {
        let rlp = [0xc9, 0x13];
        let _ : RlpList<1> = decode_list(rlp);
    }

    #[test(should_fail_with="Inconsistent rlp length")]
    fn fail_inconsistent_length() {
        let rlp = [0xc7, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x13];
        let _ : RlpList<3> = decode_list(rlp);
    }
}

mod decode_list_of_small_strings {
    use crate::rlp::decode::{decode_list_of_small_strings, RlpList, RlpFragment, STRING};

    #[test]
    fn success_empty_list() {
        let rlp = [0xc0];
        let expected = RlpList { fragments: [], num_fields: 0 };

        assert(decode_list_of_small_strings(rlp) == expected);
    }

    #[test]
    fn success() {
        let rlp = [0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x13]; //["0x636174","0x646f68","0x13"]
        let expected = RlpList {
            fragments: [
                RlpFragment { offset: 2, length: 3, data_type: STRING },
                RlpFragment { offset: 6, length: 3, data_type: STRING },
                RlpFragment { offset: 9, length: 1, data_type: STRING }
            ],
            num_fields: 3
        };

        assert(decode_list_of_small_strings(rlp) == expected);
    }

    #[test]
    fn success_comparing_with_zeros() {
        let rlp = [0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x13]; // ["0x636174","0x646f68","0x13"]
        let expected = RlpList {
            fragments: [
                RlpFragment { offset: 2, length: 3, data_type: STRING },
                RlpFragment { offset: 6, length: 3, data_type: STRING },
                RlpFragment { offset: 9, length: 1, data_type: STRING },
                RlpFragment { offset: 0, length: 0, data_type: STRING }
            ],
            num_fields: 3
        };

        assert(decode_list_of_small_strings(rlp) == expected);
    }

    #[test(should_fail_with="Inconsistent rlp length")]
    fn fail_inconsistent_length() {
        let rlp = [0xc7, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x13];
        let _ : RlpList<3> = decode_list_of_small_strings(rlp);
    }

    #[test(should_fail_with = "Expected a list")]
    fn fail_wrong_data_type() {
        let rlp_of_single_byte = [0x00];
        let _ : RlpList<1> = decode_list_of_small_strings(rlp_of_single_byte);
    }

    #[test(should_fail_with = "Decoded length of short list exceeds input length")]
    fn fail_length_exceeds_input_length() {
        let rlp = [0xc9, 0x13];
        let _ : RlpList<1> = decode_list_of_small_strings(rlp);
    }

    #[test(should_fail_with = "Element is not a string of length < 56 bytes")]
    fn fail_list_with_lists() {
        let rlp = [0xc1, 0xc0];
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
    use crate::misc::arrays::resize;

    #[test]
    fn success_single_byte() {
        let rlp = [0x00]; // "0x00"
        let expected = RlpHeader { offset: 0, length: 1, data_type: STRING };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_short_string() {
        let rlp = [0x83, 0x63, 0x61, 0x74]; // "0x636174"
        let expected = RlpHeader { offset: 1, length: 3, data_type: STRING };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_long_string() {
        let header = [0xb8, 60]; // string with 60 bytes
        let rlp : [u8; 62] = resize(header);
        let expected = RlpHeader { offset: 2, length: 60, data_type: STRING };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_empty_list() {
        let rlp = [0xc0]; // []
        let expected = RlpHeader { offset: 1, length: 0, data_type: LIST };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_short_list() {
        let rlp = [0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x18]; // ["0x636174", "0x646f68", "0x18"]
        let expected = RlpHeader { offset: 1, length: 9, data_type: LIST };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_short_list_with_lists() {
        let rlp = [0xc8, 0xc0, 0xc1, 0xc0, 0xc3, 0xc0, 0xc1, 0xc0, 0xc0]; // [[], [[]], [[], [[]], []]
        let expected = RlpHeader { offset: 1, length: 8, data_type: LIST };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test]
    fn success_long_list() {
        let header = [0xf8, 60]; // list of 60 elements
        let rlp : [u8; 62] = resize(header);
        let expected = RlpHeader { offset: 2, length: 60, data_type: LIST };
        assert(decode_to_rlp_header(rlp) == expected);
    }

    #[test(should_fail_with = "Decoded length of short string exceeds input length")]
     fn fail_wrong_short_string_rlp() {
        let rlp = [0x81];
        let _ = decode_to_rlp_header(rlp);
    }

    #[test(should_fail_with = "Decoded length of long string exceeds input length")]
     fn fail_wrong_long_string_rlp() {
        let rlp = [0xb8, 60];
        let _ = decode_to_rlp_header(rlp);
    }

    #[test(should_fail_with = ""Decoded length of short list exceeds input length")]
     fn fail_wrong_short_list_rlp() {
        let rlp = [0xc1];
        let _ = decode_to_rlp_header(rlp);
    }

    #[test(should_fail_with = ""Decoded length of long list exceeds input length")]
     fn fail_wrong_long_list_rlp() {
        let rlp = [0xf8, 60];
        let _ = decode_to_rlp_header(rlp);
    }
}

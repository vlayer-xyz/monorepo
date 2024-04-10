use crate::rlp::decode::{copy_subarray, strict_if};

#[test]
fn test_strict_if() {
    assert(strict_if(true, 1, 2) == 1);
    assert(strict_if(false, 1, 2) == 2);
}

#[test]
fn test_copy_subarray() {
    let input = [1, 2, 3, 4, 5];
    assert(copy_subarray(input, 0) == [1, 2, 3, 4, 5]);
    assert(copy_subarray(input, 2) == [3, 4, 5]);
    assert(copy_subarray(input, 5) == []);
    assert(copy_subarray(input, 6) == []);
}

mod test_extract_payload_len {
    use crate::rlp::decode::extract_payload_len;

    #[test] 
    fn unpadded() {
        let rlp_header = [249, 1, 109];
        let lenlen = (rlp_header[0] - 0xf7) as u64;
        assert(extract_payload_len(rlp_header, lenlen) == 0x016d);
    }

    #[test]
    fn padded() {
        let rlp_header = [
            249, 1, 109, 32, 185, 1, 105, 2, 249, 1, 101, 1, 132, 1, 3, 187, 10, 185, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 248, 90, 248, 88, 148, 56, 140, 129, 140, 168, 185, 37, 27, 57, 49, 49, 192, 138, 115, 106, 103, 204, 177, 146, 151, 225, 160, 39, 241, 42, 191, 227, 88, 96, 169, 169, 39, 180, 101, 187, 61, 74, 156, 35, 200, 66, 129, 116, 184, 63, 39, 143, 228, 94, 215, 180, 218, 38, 98, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 36, 230, 50, 131, 46, 62, 226, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        let lenlen = (rlp_header[0] - 0xf7) as u64;
        assert(extract_payload_len(rlp_header, lenlen) == 0x016d);
    }

    #[test(should_fail_with = "Length of length exceeds maximum")]
    fn fail_lenlen_exceeding() {
        let _ = extract_payload_len([9], 3);
    }
}

mod test_decode_string {
    use crate::rlp::decode::decode_string;

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
        let rlp = [0x83, 0x63, 0x61, 0x74];
        let expected_offset = 1;
        let expected_length = 3;
        assert(decode_string(rlp) == (expected_offset, expected_length));
    }

    #[test]
    fn using_lenlen() {
        let rlp = [0xb8, 0x01, 0x83];
        let expected_offset = 2;
        let expected_length = 1;
        assert(decode_string(rlp) == (expected_offset, expected_length));
    }

    #[test(should_fail_with = "Wrong data type")]
    fn fail_list_type() {
        let rlp_of_list_type = [0xc0];
        let _ = decode_string(rlp_of_list_type);
    }

    #[test(should_fail_with = "Length exceeds input length")]
    fn fail_length_exceeds_input_length() {
        let rlp_with_wrong_length = [0x89]; // length is 9, but 0 bytes of payload is provided
        let _ = decode_string(rlp_with_wrong_length);
    }
}

mod test_decode_list {
    use crate::rlp::{decode::{decode_list, RlpList, STRING}, fragment::RlpFragment};

    #[test]
    fn empty() {
        let empty_list: RlpList<1> = decode_list([0xc0]);
        assert(empty_list.num_fields == 0);
    }

    #[test]
    fn three_elements() {
        let rlp = [0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0, 0];
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

    #[test]
    fn seventeen_elements() {
        let rlp = [
            249, 2, 17, 160, 10, 210, 58, 71, 229, 91, 254, 185, 245, 139, 35, 127, 191, 50, 125, 165, 19, 165, 59, 86, 127, 77, 226, 197, 94, 143, 9, 69, 104, 149, 113, 39, 160, 164, 115, 165, 166, 228, 180, 44, 203, 222, 52, 48, 157, 214, 190, 69, 130, 116, 84, 133, 170, 215, 193, 212, 152, 106, 149, 100, 253, 145, 220, 246, 94, 160, 69, 11, 1, 238, 164, 195, 225, 91, 51, 198, 134, 50, 21, 34, 253, 120, 157, 26, 173, 81, 148, 24, 94, 179, 165, 5, 99, 85, 90, 78, 104, 180, 160, 82, 128, 145, 254, 48, 73, 106, 165, 234, 223, 46, 5, 168, 79, 141, 218, 64, 98, 200, 87, 199, 28, 213, 222, 164, 182, 145, 219, 253, 186, 121, 39, 160, 167, 139, 46, 219, 193, 195, 174, 240, 47, 40, 188, 121, 97, 50, 227, 220, 35, 99, 122, 36, 94, 78, 156, 78, 197, 54, 232, 163, 249, 213, 16, 58, 160, 111, 180, 73, 26, 200, 238, 6, 49, 66, 159, 230, 23, 226, 13, 10, 230, 7, 51, 103, 45, 139, 187, 57, 125, 86, 1, 146, 77, 200, 196, 223, 158, 160, 55, 41, 196, 37, 89, 112, 4, 6, 183, 246, 239, 121, 175, 146, 171, 71, 19, 99, 239, 56, 75, 116, 235, 20, 239, 208, 243, 25, 211, 222, 248, 120, 160, 203, 87, 65, 73, 168, 197, 46, 86, 209, 173, 204, 46, 232, 157, 204, 145, 75, 151, 105, 166, 72, 142, 173, 255, 186, 120, 43, 121, 104, 228, 130, 134, 160, 150, 115, 130, 186, 247, 99, 108, 21, 244, 243, 60, 208, 96, 34, 93, 32, 175, 77, 181, 18, 59, 49, 192, 153, 255, 123, 231, 108, 251, 75, 134, 92, 160, 78, 107, 27, 31, 43, 92, 213, 101, 63, 87, 83, 248, 163, 19, 104, 103, 84, 248, 119, 180, 32, 209, 82, 52, 250, 148, 101, 219, 76, 194, 160, 125, 160, 83, 37, 183, 243, 189, 9, 79, 122, 28, 120, 150, 139, 190, 225, 222, 184, 206, 225, 117, 233, 244, 162, 244, 212, 38, 220, 37, 129, 215, 25, 93, 53, 160, 229, 6, 255, 207, 78, 120, 107, 238, 212, 128, 106, 189, 84, 39, 136, 172, 149, 67, 89, 238, 163, 122, 88, 90, 149, 80, 59, 121, 249, 7, 238, 1, 160, 81, 214, 156, 64, 149, 165, 65, 36, 216, 223, 167, 73, 213, 180, 230, 230, 32, 106, 193, 147, 176, 40, 93, 119, 210, 13, 1, 159, 16, 112, 114, 103, 160, 211, 15, 4, 49, 74, 86, 24, 146, 109, 246, 80, 207, 194, 97, 226, 153, 241, 94, 43, 233, 192, 2, 152, 171, 150, 86, 26, 250, 234, 179, 74, 156, 160, 175, 157, 156, 73, 109, 26, 48, 12, 182, 175, 211, 173, 181, 241, 131, 247, 105, 98, 255, 101, 7, 227, 21, 63, 78, 41, 155, 58, 231, 222, 15, 141, 160, 219, 213, 163, 116, 191, 119, 232, 215, 182, 77, 130, 102, 90, 48, 66, 197, 228, 202, 43, 169, 232, 246, 11, 23, 100, 50, 211, 205, 202, 115, 60, 49, 128
        ];

        let expected = RlpList {
            fragments: [
                RlpFragment { offset: 4, length: 32, data_type: STRING },
                RlpFragment { offset: 37, length: 32, data_type: STRING },
                RlpFragment { offset: 70, length: 32, data_type: STRING },
                RlpFragment { offset: 103, length: 32, data_type: STRING },
                RlpFragment { offset: 136, length: 32, data_type: STRING },
                RlpFragment { offset: 169, length: 32, data_type: STRING },
                RlpFragment { offset: 202, length: 32, data_type: STRING },
                RlpFragment { offset: 235, length: 32, data_type: STRING },
                RlpFragment { offset: 268, length: 32, data_type: STRING },
                RlpFragment { offset: 301, length: 32, data_type: STRING },
                RlpFragment { offset: 334, length: 32, data_type: STRING },
                RlpFragment { offset: 367, length: 32, data_type: STRING },
                RlpFragment { offset: 400, length: 32, data_type: STRING },
                RlpFragment { offset: 433, length: 32, data_type: STRING },
                RlpFragment { offset: 466, length: 32, data_type: STRING },
                RlpFragment { offset: 499, length: 32, data_type: STRING },
                RlpFragment { offset: 532, length: 0, data_type: STRING },
                RlpFragment { offset: 0, length: 0, data_type: STRING }
            ],
            num_fields: 17
        };
        assert(decode_list(rlp) == expected);
    }
}

mod test_decode_list_of_small_strings {
    use crate::rlp::decode::{decode_list_of_small_strings, RlpList, RlpFragment, STRING};

    #[test]
    fn success_empty_list() {
        let rlp = [0xc0];
        let expected = RlpList { fragments: [], num_fields: 0 };

        assert(decode_list_of_small_strings(rlp) == expected);
    }

    #[test]
    fn success() {
        let rlp = [0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x13];
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
        let rlp = [0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0x13];
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

    #[test(should_fail_with = "Total length exceeds input length")]
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

mod test_get_small_string_offset_and_length {
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

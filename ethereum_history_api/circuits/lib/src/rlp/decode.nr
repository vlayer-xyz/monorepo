use dep::std::wrapping_sub;

/// Max number of bytes required to represent length of a string or list
global MAX_LEN_IN_BYTES: u64 = 2;

/// RLP data type enum
global STRING: u64 = 0;
global LIST: u64 = 1;

struct RlpHeader {
    offset: u64,
    length: u64, 
    data_type: u64 // STRING or LIST    
}

impl RlpHeader {
    pub fn new(offset: u64, length: u64, data_type: u64) -> Self {
        RlpHeader { offset, length, data_type }
    }
}

struct RlpFragment {
    offset: u64,
    length: u64,    
    data_type: u64 // STRING or LIST
}

impl Default for RlpFragment {
    fn default() -> Self {
        RlpFragment { offset: 0, length: 0, data_type: 0 }
    }
}

struct RlpList<NUM_FIELDS> {
    fragments: [RlpFragment; NUM_FIELDS],
    num_fields: u64
}

impl<NUM_FIELDS> RlpList<NUM_FIELDS> {
    pub fn new(fragments: [RlpFragment; NUM_FIELDS], num_fields: u64) -> Self {
        RlpList { fragments, num_fields }
    }
}

/// Payload length extractor. Returns length of RLP payload in the case its length
/// exceeds 56 bytes.
///
/// # Arguments
/// * `arr` - RLP-encoded list
/// * `lenlen` - Number of bytes containing the length of the payload
pub fn data_len<N>(arr: [u8; N], lenlen: u64) -> u64 {
    assert(lenlen <= MAX_LEN_IN_BYTES);
    let mut payload_length = 0;

    // Restrict loop to maximum length in bytes
    let loop_len_ind = (MAX_LEN_IN_BYTES < (N - 1)) as u64;
    let loop_len = (loop_len_ind as Field * (MAX_LEN_IN_BYTES as Field - (N - 1) as Field) as Field + N as Field - 1) as u64;

    for i in 0..loop_len {
        if (i < lenlen) {
            payload_length = (arr[i + 1] as u64) + payload_length * 256;
        }
    }

    payload_length
}

pub fn decode_to_rlp_header<N>(arr: [u8; N]) -> RlpHeader {
    let prefix = arr[0];

    // Prefix range indicators
    let is_single_byte = (prefix < 0x80); // Single byte
    let is_short_string = (prefix < 0xb8); // 0-55 byte string
    let is_long_string = (prefix < 0xc0); // >55-byte string
    let is_short_list = (prefix < 0xf8); // 0-55 byte list
    // Else >55-byte list

    let offset = strict_if(
        is_single_byte,
        0,
        strict_if(
            is_short_string,
            1,
            strict_if(
                is_long_string,
                wrapping_sub(1 + prefix, 0xb7) as u64,
                strict_if(is_short_list, 1, wrapping_sub(1 + prefix, 0xf7) as u64)
            )
        )
    );

    // To compute length, first determine how many of the following bytes contain the length of the payload.
    let lenlen = is_long_string as u64 * (1 - is_short_string as u64) * wrapping_sub(prefix, 0xb7) as u64
        + (1 - is_short_list as u64) * wrapping_sub(prefix, 0xf7) as u64;

    // Set length according to whether it is contained in the prefix (i.e. lenlen == 0).
    let len = strict_if(
        lenlen == 0,
        strict_if(
            is_single_byte,
            1,
            strict_if(
                is_short_string,
                wrapping_sub(prefix, 0x80) as u64,
                wrapping_sub(prefix, 0xc0) as u64
            )
        ),
        data_len(arr, lenlen)
    );

    let data_type = (prefix >= 0xc0) as u64;

    RlpHeader::new(offset, len, data_type)
}

/// RLP string decoder. Returns offset and length of RLP-encoded string as a tuple.
pub fn decode_string<N>(input: [u8; N]) -> (u64, u64) {
    let mut RlpHeader {offset, length, data_type} = decode_to_rlp_header(input);

    let total_len = length + offset;

    assert(data_type == STRING);

    assert(total_len <= input.len());

    (offset, length)
}

/// RLP list decoder. Returns an RLP list look-up table.
///
/// # Quirks
/// * For string elements, the offset points to the payload, whereas the offset
///   of a list element points to the RLP header of that element.
pub fn decode_list<N, NUM_FIELDS>(input: [u8; N]) -> RlpList<NUM_FIELDS> {
    let mut num_fields: u64 = 0;
    let mut fragments = [RlpFragment::default(); NUM_FIELDS];

    let mut RlpHeader {offset, length: payload_len, data_type: input_type} = decode_to_rlp_header(input);

    let total_len = payload_len + offset;

    assert(input_type == LIST);

    let total_len = payload_len + offset;

    assert(total_len <= input.len());

    for i in 0..NUM_FIELDS {
        let loop_ind = (offset != total_len) as u64;

        // Make sure the index doesn't overshoot
        let header: [u8; MAX_LEN_IN_BYTES + 1] = copy_subarray(input, offset);
        let RlpHeader {offset: field_off, length: field_len, data_type: field_type} = decode_to_rlp_header(header);
        let total_field_len = field_off + field_len;

        // Assign decoded data and set them to 0 if loop indicator false (Convenient for testing; could remove this later)
        fragments[i].offset = loop_ind * (offset + (1 - field_type) * field_off); // If the ith slot contains a list, include its RLP header.
        fragments[i].length = loop_ind * (field_len + field_type * field_off); // If the ith slot contains a list, make sure to include the length of its header in the decoded data.
        fragments[i].data_type = loop_ind * (field_type);

        offset += loop_ind * total_field_len;
        num_fields += loop_ind;
    }

    assert(total_len == offset);

    RlpList::new(fragments, num_fields)
}

/// RLP list decoder for lists of strings of length < 56 bytes.
/// Returns an RLP list look-up table.
pub fn decode_list_of_small_strings<N, NUM_FIELDS>(input: [u8; N]) -> RlpList<NUM_FIELDS> {
    let mut num_fields: u64 = 0;
    let mut fragments = [RlpFragment::default(); NUM_FIELDS];

    let mut RlpHeader {offset, length: payload_len, data_type: input_type} = decode_to_rlp_header(input);
    let total_len = payload_len + offset;

    assert(input_type == LIST);
    assert(total_len <= input.len());

    for i in 0..NUM_FIELDS {
        let loop_ind = (offset != total_len) as u64;

        let header = input[offset];

        assert(header < 0xb8); // Header must represent a string of length < 56 bytes.

        let field_type = STRING;

        let single_byte_ind = (header < 0x80) as u64; // 1 if `header` represents a single byte.

        let field_off = 1 - single_byte_ind; // If `header` < 0x80, then we are dealing with a single byte whose value
        // is given by header. Else, the string begins at the following index.

        let field_len = single_byte_ind * 1 + (1 - single_byte_ind) * (wrapping_sub(header, 0x80) as u64); // Single byte means len = 1,
        // else subtract 0x80 from the header to determine len.

        let total_field_len = field_off + field_len;

        fragments[i].offset = loop_ind * (offset + field_off);
        fragments[i].length = loop_ind * (field_len);
        fragments[i].data_type= loop_ind * (field_type);

        offset += loop_ind * total_field_len;
        num_fields += loop_ind;
    }

    assert(total_len == offset);

    RlpList::new(fragments, num_fields)
}

pub fn copy_subarray<T, N, M>(arr: [T; N], offset: u64) -> [T; M] {
    let mut out = [dep::std::unsafe::zeroed(); M];

    for i in 0..M {
        let j = (((offset + i) as u64) < N) as u64 * (offset + i); // Restrict to proper range and fill with arr[0] otherwise.
        out[i] = arr[j];
    }

    out
}

// Leads to fewer constraints than the usual if.
pub fn strict_if(pred: bool, x: u64, y: u64) -> u64 {
    let pred_f = pred as u64;
    pred_f * x + (1 - pred_f) * y
}

#[test]
fn rlp_decode_test() {
    // Decode empty list
    let empty_list: RlpList<1> = decode_list([0xc0]);

    assert(empty_list.num_fields == 0);

    // Decode a list of 3 elements
    let input = [0xc9, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x68, 0, 0];
    let output: RlpList<5> = decode_list(input);

    assert(output.num_fields == 3);
    let expected_offsets = [2, 6, 9, 0, 0];
    let expected_lengths = [3, 3, 1, 0, 0];
    let expected_data_types = [STRING; 5];
    for i in 0..5 {
        assert(output.fragments[i].offset == expected_offsets[i]);
        assert(output.fragments[i].length == expected_lengths[i]);
        assert(output.fragments[i].data_type == expected_data_types[i]);
    }

    // Decode a list of 17 elements
    let input1 = [
        249, 2, 17, 160, 10, 210, 58, 71, 229, 91, 254, 185, 245, 139, 35, 127, 191, 50, 125, 165, 19, 165, 59, 86, 127, 77, 226, 197, 94, 143, 9, 69, 104, 149, 113, 39, 160, 164, 115, 165, 166, 228, 180, 44, 203, 222, 52, 48, 157, 214, 190, 69, 130, 116, 84, 133, 170, 215, 193, 212, 152, 106, 149, 100, 253, 145, 220, 246, 94, 160, 69, 11, 1, 238, 164, 195, 225, 91, 51, 198, 134, 50, 21, 34, 253, 120, 157, 26, 173, 81, 148, 24, 94, 179, 165, 5, 99, 85, 90, 78, 104, 180, 160, 82, 128, 145, 254, 48, 73, 106, 165, 234, 223, 46, 5, 168, 79, 141, 218, 64, 98, 200, 87, 199, 28, 213, 222, 164, 182, 145, 219, 253, 186, 121, 39, 160, 167, 139, 46, 219, 193, 195, 174, 240, 47, 40, 188, 121, 97, 50, 227, 220, 35, 99, 122, 36, 94, 78, 156, 78, 197, 54, 232, 163, 249, 213, 16, 58, 160, 111, 180, 73, 26, 200, 238, 6, 49, 66, 159, 230, 23, 226, 13, 10, 230, 7, 51, 103, 45, 139, 187, 57, 125, 86, 1, 146, 77, 200, 196, 223, 158, 160, 55, 41, 196, 37, 89, 112, 4, 6, 183, 246, 239, 121, 175, 146, 171, 71, 19, 99, 239, 56, 75, 116, 235, 20, 239, 208, 243, 25, 211, 222, 248, 120, 160, 203, 87, 65, 73, 168, 197, 46, 86, 209, 173, 204, 46, 232, 157, 204, 145, 75, 151, 105, 166, 72, 142, 173, 255, 186, 120, 43, 121, 104, 228, 130, 134, 160, 150, 115, 130, 186, 247, 99, 108, 21, 244, 243, 60, 208, 96, 34, 93, 32, 175, 77, 181, 18, 59, 49, 192, 153, 255, 123, 231, 108, 251, 75, 134, 92, 160, 78, 107, 27, 31, 43, 92, 213, 101, 63, 87, 83, 248, 163, 19, 104, 103, 84, 248, 119, 180, 32, 209, 82, 52, 250, 148, 101, 219, 76, 194, 160, 125, 160, 83, 37, 183, 243, 189, 9, 79, 122, 28, 120, 150, 139, 190, 225, 222, 184, 206, 225, 117, 233, 244, 162, 244, 212, 38, 220, 37, 129, 215, 25, 93, 53, 160, 229, 6, 255, 207, 78, 120, 107, 238, 212, 128, 106, 189, 84, 39, 136, 172, 149, 67, 89, 238, 163, 122, 88, 90, 149, 80, 59, 121, 249, 7, 238, 1, 160, 81, 214, 156, 64, 149, 165, 65, 36, 216, 223, 167, 73, 213, 180, 230, 230, 32, 106, 193, 147, 176, 40, 93, 119, 210, 13, 1, 159, 16, 112, 114, 103, 160, 211, 15, 4, 49, 74, 86, 24, 146, 109, 246, 80, 207, 194, 97, 226, 153, 241, 94, 43, 233, 192, 2, 152, 171, 150, 86, 26, 250, 234, 179, 74, 156, 160, 175, 157, 156, 73, 109, 26, 48, 12, 182, 175, 211, 173, 181, 241, 131, 247, 105, 98, 255, 101, 7, 227, 21, 63, 78, 41, 155, 58, 231, 222, 15, 141, 160, 219, 213, 163, 116, 191, 119, 232, 215, 182, 77, 130, 102, 90, 48, 66, 197, 228, 202, 43, 169, 232, 246, 11, 23, 100, 50, 211, 205, 202, 115, 60, 49, 128
    ];

    let output1: RlpList<17> = decode_list(input1);

    assert(output1.num_fields == 17);
    let expected_offsets1 = [4, 37, 70, 103, 136, 169, 202, 235, 268, 301, 334, 367, 400, 433, 466, 499, 532];
    let expected_lengths1 = [32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0];
    let expected_data_types1 = [STRING; 17];
    for i in 0..17 {
        assert(output1.fragments[i].offset == expected_offsets1[i]);
        assert(output1.fragments[i].length == expected_lengths1[i]);
        assert(output1.fragments[i].data_type == expected_data_types1[i]);
    }
}

// Test data length decoding on the RLP header of a >55-byte list
#[test]
fn data_len_test_unpadded() {
    let RlpHeader = [249, 1, 109];
    let lenlen = (RlpHeader[0] - 0xf7) as u64;
    assert(data_len(RlpHeader, lenlen) == 0x016d);
}

// Test data length decoding on an RLP encoded >55-byte list with additional padding
#[test]
fn data_len_test_padded() {
    let RlpHeader = [
        249, 1, 109, 32, 185, 1, 105, 2, 249, 1, 101, 1, 132, 1, 3, 187, 10, 185, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 248, 90, 248, 88, 148, 56, 140, 129, 140, 168, 185, 37, 27, 57, 49, 49, 192, 138, 115, 106, 103, 204, 177, 146, 151, 225, 160, 39, 241, 42, 191, 227, 88, 96, 169, 169, 39, 180, 101, 187, 61, 74, 156, 35, 200, 66, 129, 116, 184, 63, 39, 143, 228, 94, 215, 180, 218, 38, 98, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 36, 230, 50, 131, 46, 62, 226, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    let lenlen = (RlpHeader[0] - 0xf7) as u64;
    assert(data_len(RlpHeader, lenlen) == 0x016d);
}

// Test RLP header decoding
#[test]
fn rlp_length_check() {
    // List test case
    let in0: [u8; MAX_LEN_IN_BYTES + 1] = copy_subarray([0xc7, 0xc0, 0xc1, 0xc0, 0xc3, 0xc0, 0xc1, 0xc0], 0);
    let x = decode_to_rlp_header(in0);
    assert(x.offset == 1);
    assert(x.length == 7);
    assert(x.data_type == LIST);

    // String test case
    let y = decode_to_rlp_header([0x82, 0x04, 0x00]);
    assert(y.offset == 1);
    assert(y.length == 2);
    assert(y.data_type == STRING);

    // Longer string test case
    let z = decode_to_rlp_header(
        [
        185, 4, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 0
    ]
    );
    assert(z.offset == 3);
    assert(z.length == 1024);
    assert(z.data_type == STRING);
}

use crate::misc::rlp_list::RlpList;
use crate::misc::rlp_fragment::RlpFragment;
use crate::misc::fragment::Fragment;
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

impl Eq for RlpHeader {
    fn eq(self, other: Self) -> bool {
        (self.offset == other.offset) & (self.length == other.length) & (self.data_type == other.data_type)
    }
}

/// Returns an RLP list look-up table.
/// For string elements, the offset points to the payload, whereas the offset
///   of a list element points to the RLP header of that element.
pub fn decode_list<MAX_BYTES_LEN, MAX_FIELDS>(input: [u8; MAX_BYTES_LEN]) -> RlpList<MAX_BYTES_LEN, MAX_FIELDS> {
    let mut num_fields: u64 = 0;
    let mut rlp_list: RlpList<MAX_BYTES_LEN, MAX_FIELDS> = BoundedVec::new();

    let RlpHeader {offset, length, data_type} = decode_to_rlp_header(input);
    assert(data_type == LIST, "Expected a list");

    let total_len = length + offset;
    assert(total_len <= input.len(), "Total length exceeds input length");

    let mut current_offset = offset;
    for _ in 0..MAX_FIELDS {
        if (current_offset < total_len) {
            let header: [u8; MAX_BYTES_LEN] = copy_subarray(input, current_offset);

            let RlpHeader {offset: field_off, length: field_len, data_type} = decode_to_rlp_header(header);

            let fragment = RlpFragment {
                fragment: Fragment {
                    offset: current_offset + (1 - data_type) * field_off, // If the ith slot contains a list, include its RLP header.
                    length: field_len + data_type * field_off, // If the ith slot contains a list, include the length of its header.
                    data: input
                },
                data_type
            };
            rlp_list.push(fragment);

            current_offset += field_off + field_len;
            num_fields += 1;
        }
    }
    assert(current_offset == total_len, "Inconsistent rlp length");

    rlp_list
}

// RLP list decoder for lists of strings of length < 56 bytes.
/// Returns an RLP list look-up table.
pub fn decode_list_of_small_strings<MAX_BYTES_LEN, MAX_FIELDS>(input: [u8; MAX_BYTES_LEN]) -> RlpList<MAX_BYTES_LEN, MAX_FIELDS> {
    let mut num_fields: u64 = 0;
    let mut rlp_list: RlpList<MAX_BYTES_LEN, MAX_FIELDS> = BoundedVec::new();

    let RlpHeader {offset, length, data_type} = decode_to_rlp_header(input);
    assert(data_type == LIST, "Expected a list");

    let total_len = length + offset;
    assert(total_len <= input.len(), "Total length exceeds input length");

    let mut current_offset = offset;
    for _ in 0..MAX_FIELDS {
        if (current_offset < total_len) {
            let first_byte = input[current_offset];

            let (field_off, field_len) = get_small_string_offset_and_length(first_byte);

            let fragment = RlpFragment {
                fragment: Fragment {
                    offset: current_offset + field_off,
                    length: field_len,
                    data: input
                },
                data_type: STRING
            };
            rlp_list.push(fragment);

            current_offset += field_off + field_len;
            num_fields += 1;
        }
    }
    assert(current_offset == total_len, "Inconsistent rlp length");

    rlp_list
}

pub fn decode_string<N>(input: [u8; N]) -> (u64, u64) {
    let mut RlpHeader {offset, length, data_type} = decode_to_rlp_header(input);
    assert(data_type == STRING, "Wrong data type");

    let total_len = length + offset;
    assert(total_len <= input.len(), "Total length exceeds input length");

    (offset, length)
}

pub fn get_small_string_offset_and_length(first_byte: u8) -> (u64, u64) {
    assert(first_byte < 0xb8, "Element is not a string of length < 56 bytes");

    if (first_byte < 0x80) {
        (0, 1)
    } else {
        (1, wrapping_sub(first_byte as u64, 0x80))
    }
}

pub fn extract_payload_len<N>(arr: [u8; N], lenlen: u64) -> u64 {
    assert(lenlen <= MAX_LEN_IN_BYTES, "Length of length exceeds maximum");
    assert(lenlen < N, "Length of length exceeds input length");
    assert(lenlen != 0, "Length of length is zero");

    let mut payload_length = 0;

    let mut loop_len: u64 = 0;
    if (MAX_LEN_IN_BYTES < N - 1) {
        loop_len = MAX_LEN_IN_BYTES;
    } else {
        loop_len = N - 1;
    }

    for i in 0..loop_len {
        if (i < lenlen) {
            payload_length = (arr[i + 1] as u64) + payload_length * 256;
        }
    }

    payload_length
}

pub fn decode_to_rlp_header<N>(arr: [u8; N]) -> RlpHeader {
    let prefix = arr[0];

    if (prefix < 0x80) { // single byte
        RlpHeader { offset: 0, length: 1, data_type: STRING }
    } else if (prefix < 0xb8) { // 0-55 byte string
        let offset = 1;
        let length = wrapping_sub(prefix, 0x80) as u64;
        assert(offset + length <= N, "Decoded length of short string exceeds input length");

        RlpHeader { offset, length, data_type: STRING }
    } else if (prefix < 0xc0) { // >55-byte string
        let offset = wrapping_sub(1 + prefix, 0xb7) as u64;
        let length = extract_payload_len(arr, wrapping_sub(prefix, 0xb7) as u64);
        assert(offset + length <= N, "Decoded length of long string exceeds input length");

        RlpHeader { offset, length, data_type: STRING }
    } else if (prefix < 0xf8) { // 0-55 byte list
        let offset = 1;
        let length = wrapping_sub(prefix, 0xc0) as u64;
        assert(offset + length <= N, "Decoded length of short list exceeds input length");

        RlpHeader { offset, length, data_type: LIST }
    } else { // >55-byte list
        let offset = wrapping_sub(1 + prefix, 0xf7) as u64;
        let length = extract_payload_len(arr, wrapping_sub(prefix, 0xf7) as u64);
        assert(offset + length <= N, "Decoded length of long list exceeds input length");

        RlpHeader { offset, length, data_type: LIST }
    }
}

pub fn copy_subarray<T, N, M>(arr: [T; N], offset: u64) -> [T; M] {
    let mut out = [dep::std::unsafe::zeroed(); M];

    for i in 0..M {
        let j = (((offset + i) as u64) < N) as u64 * (offset + i); // Restrict to proper range and fill with arr[0] otherwise.
        out[i] = arr[j];
    }

    out
}

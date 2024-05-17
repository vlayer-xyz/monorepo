use dep::std::wrapping_sub;
use crate::rlp::types::{RlpList, RlpFragment, RlpHeader};
use crate::misc::fragment::Fragment;

/// Max number of bytes required to represent length of a string or list
global MAX_LEN_IN_BYTES: u64 = 2;

/// RLP data type enum
global STRING: u64 = 0;
global LIST: u64 = 1;

pub fn extract_payload_len<N>(data: Fragment<N, u8>, lenlen: u64) -> u64 {
    assert(lenlen <= MAX_LEN_IN_BYTES, "Length of length exceeds maximum");
    assert(lenlen <= data.length, "Length of length exceeds input length");
    assert(lenlen != 0, "Length of length is zero");

    let mut payload_length = 0;

    for i in 0..MAX_LEN_IN_BYTES {
        if (i < lenlen & i < data.length) {
            payload_length = data.at(i) as u64 + payload_length * 256;
        }
    }

    payload_length
}

pub fn decode_to_rlp_header<N>(data: Fragment<N, u8>) -> RlpHeader {
    let mut data = data;
    let prefix = data.pop_front();

    if (prefix < 0x80) { // single byte
        RlpHeader { offset: 0, length: 1, data_type: STRING }
    } else if (prefix < 0xb8) { // 0-55 byte string
        let offset = 1;
        let length = wrapping_sub(prefix, 0x80) as u64;
        assert(offset + length <= N, "Decoded length of short string exceeds input length");

        RlpHeader { offset, length, data_type: STRING }
    } else if (prefix < 0xc0) { // >55-byte string
        let offset = wrapping_sub(1 + prefix, 0xb7) as u64;
        let length = extract_payload_len(data, wrapping_sub(prefix, 0xb7) as u64);
        assert(offset + length <= N, "Decoded length of long string exceeds input length");

        RlpHeader { offset, length, data_type: STRING }
    } else if (prefix < 0xf8) { // 0-55 byte list
        let offset = 1;
        let length = wrapping_sub(prefix, 0xc0) as u64;
        assert(offset + length <= N, "Decoded length of short list exceeds input length");

        RlpHeader { offset, length, data_type: LIST }
    } else { // >55-byte list
        let offset = wrapping_sub(1 + prefix, 0xf7) as u64;
        let length = extract_payload_len(data, wrapping_sub(prefix, 0xf7) as u64);
        assert(offset + length <= N, "Decoded length of long list exceeds input length");

        RlpHeader { offset, length, data_type: LIST }
    }
}

pub fn decode_string<N>(input: Fragment<N, u8>) -> RlpFragment {
    let mut RlpHeader {offset, length, data_type} = decode_to_rlp_header(input);
    assert(data_type == STRING, "Wrong data type");

    let total_len = length + offset;
    assert(total_len <= input.length, "Total length exceeds input length");

    RlpFragment { offset, length, data_type: STRING }
}

/// Returns an RLP list look-up table.
/// For string elements, the offset points to the payload, whereas the offset
///   of a list element points to the RLP header of that element.
pub fn decode_list<N, MAX_FIELDS>(data: Fragment<N, u8>) -> RlpList<MAX_FIELDS> {
    let mut rlp_list: RlpList<MAX_FIELDS> = BoundedVec::new();

    let RlpHeader {offset, length, data_type} = decode_to_rlp_header(data);
    assert(data_type == LIST, "Expected a list");

    let total_len = length + offset;
    assert(total_len <= data.length, "Total length exceeds input length");

    let mut current_offset = offset;
    for _ in 0..MAX_FIELDS {
        if (current_offset < total_len) {
            let header: Fragment<N, u8> = data.subfragment(current_offset, data.length - current_offset);

            let RlpHeader {offset: field_off, length: field_len, data_type: field_type} = decode_to_rlp_header(header);

            let fragment = RlpFragment {
                offset: current_offset + (1 - field_type) * field_off, // If the ith slot contains a list, include its RLP header.
                length: field_len + field_type * field_off, // If the ith slot contains a list, include the length of its header.
                data_type: field_type
            };
            rlp_list.push(fragment);

            current_offset += field_off + field_len;
        }
    }
    assert(current_offset == total_len, "Inconsistent rlp length");

    rlp_list
}

/// RLP list decoder for lists of strings of length < 56 bytes.
/// Returns an RLP list look-up table.
pub fn decode_list_of_small_strings<N, NUM_FIELDS>(data: Fragment<N, u8>) -> RlpList<NUM_FIELDS> {
    let mut rlp_list: RlpList<NUM_FIELDS> = BoundedVec::new();

    let RlpHeader {offset, length, data_type} = decode_to_rlp_header(data);
    assert(data_type == LIST, "Expected a list");

    let total_len = length + offset;
    assert(total_len <= data.length, "Total length exceeds input length");

    let mut current_offset = offset;
    for _ in 0..NUM_FIELDS {
        if (current_offset < total_len) {
            let first_byte = data.at(current_offset);

            let (field_off, field_len) = get_small_string_offset_and_length(first_byte);

            let fragment = RlpFragment { offset: current_offset + field_off, length: field_len, data_type: STRING };
            rlp_list.push(fragment);

            current_offset += field_off + field_len;
        }
    }
    assert(current_offset == total_len, "Inconsistent rlp length");

    rlp_list
}

pub fn get_small_string_offset_and_length(first_byte: u8) -> (u64, u64) {
    assert(first_byte < 0xb8, "Element is not a string of length < 56 bytes");

    if (first_byte < 0x80) {
        (0, 1)
    } else {
        (1, wrapping_sub(first_byte as u64, 0x80))
    }
}

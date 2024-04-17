use crate::misc::fragment::Fragment;
use crate::rlp::decode::{decode_to_rlp_header, copy_subarray, RlpHeader, LIST, STRING};
use crate::rlp::rlp_fragment::RlpFragment;
use crate::misc::bounded_vecs::bounded_vec_from_array;

struct FragmentWithDataType<MAX_BYTES_LEN> {
    fragment: Fragment<MAX_BYTES_LEN>,
    data_type: u64 // STRING or LIST
}

type RlpList<MAX_BYTES_LEN, MAX_FIELDS> = BoundedVec<FragmentWithDataType<MAX_BYTES_LEN>, MAX_FIELDS>;

pub fn create_rlp_list<MAX_BYTES_LEN, N, MAX_FIELDS>(fragments: [FragmentWithDataType<MAX_BYTES_LEN>; N]) -> RlpList<MAX_BYTES_LEN, MAX_FIELDS> {
    let rlp_list = bounded_vec_from_array(fragments);
    rlp_list
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

            let fragment = FragmentWithDataType {
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

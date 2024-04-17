use crate::misc::rlp_list::RlpList;
use crate::misc::rlp_fragment::RlpFragment;
use crate::misc::fragment::Fragment;
use crate::rlp::decode::{RlpHeader, decode_to_rlp_header, LIST, copy_subarray, STRING};

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

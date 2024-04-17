use crate::misc::fragment::Fragment;
use crate::rlp::decode::{decode_to_rlp_header, copy_subarray, RlpHeader, LIST, STRING};
use crate::misc::rlp_fragment::RlpFragment;
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

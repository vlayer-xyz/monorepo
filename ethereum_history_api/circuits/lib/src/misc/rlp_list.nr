use crate::misc::rlp_fragment::RlpFragment;
use crate::misc::bounded_vecs::bounded_vec_from_array;

type RlpList<MAX_BYTES_LEN, MAX_FIELDS> = BoundedVec<RlpFragment<MAX_BYTES_LEN>, MAX_FIELDS>;

pub fn create_rlp_list<MAX_BYTES_LEN, N, MAX_FIELDS>(fragments: [RlpFragment<MAX_BYTES_LEN>; N]) -> RlpList<MAX_BYTES_LEN, MAX_FIELDS> {
    let rlp_list = bounded_vec_from_array(fragments);
    rlp_list
}

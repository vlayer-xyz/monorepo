use crate::rlp::fragment::RlpFragment;
use crate::misc::bounded_vecs::bounded_vec_from_array;

type RlpList<MAX_FIELDS> = BoundedVec<RlpFragment, MAX_FIELDS>;

pub fn create_rlp_list<N, MAX_FIELDS>(fragments: [RlpFragment; N]) -> RlpList<MAX_FIELDS> {
    let rlp_list = bounded_vec_from_array(fragments);
    rlp_list
}

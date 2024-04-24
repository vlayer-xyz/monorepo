use crate::rlp::fragment::RlpFragment;
use crate::misc::bounded_vecs::bounded_vec_from_array;

type RlpList<MAX_FIELDS> = BoundedVec<RlpFragment, MAX_FIELDS>;

use crate::rlp::fragment::RlpFragment;

type RlpList<MAX_FIELDS> = BoundedVec<RlpFragment, MAX_FIELDS>;

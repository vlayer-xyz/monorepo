use crate::misc::fragment::Fragment;
use crate::rlp::decode::{decode_to_rlp_header, copy_subarray, RlpHeader, LIST};
use crate::rlp::fragment::RlpFragment;

type RlpList<MAX_BYTES_LEN, MAX_FIELDS> = BoundedVec<Fragment<MAX_BYTES_LEN>, MAX_FIELDS>;
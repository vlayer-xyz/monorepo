use crate::misc::fragment::Fragment;

struct RlpFragment<MAX_BYTES_LEN> {
    fragment: Fragment<MAX_BYTES_LEN>,
    data_type: u64 // STRING or LIST
}

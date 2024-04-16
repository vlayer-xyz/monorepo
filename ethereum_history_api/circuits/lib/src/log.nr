use crate::misc::types::{Address, Bytes32};
use dep::std::unsafe::zeroed;

struct Log<MAX_LOG_DATA_LEN> {
    address: Address,
    topics: BoundedVec<Bytes32, 4>,
    data: BoundedVec<u8, MAX_LOG_DATA_LEN>,
}

struct LogWithinBlock<MAX_LOG_DATA_LEN> {
    log: Log<MAX_LOG_DATA_LEN>,
    block_hash: Bytes32
}

pub fn get_log<MAX_LOG_DATA_LEN>(_block_number: Field, _tx_idx: Field, _log_idx: Field) -> LogWithinBlock<MAX_LOG_DATA_LEN> {
    assert(false, "Not implemented");
    zeroed()
}
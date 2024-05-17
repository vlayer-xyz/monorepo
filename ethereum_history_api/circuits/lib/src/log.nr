use crate::{
    misc::{
    types::{Address, Bytes32, ADDRESS_LENGTH, BYTES32_LENGTH}, fragment::Fragment,
    arrays::subarray_inferred_len
},
    rlp::{decode::decode_list, types::{RlpList, RlpFragment}},
    verifiers::receipt::{MAX_RECEIPT_RLP_LENGTH, rlp::RECEIPT_FIELDS_COUNT}
};
use dep::std::unsafe::zeroed;

global MAX_TOPICS_COUNT = 4;
global LOG_FIELDS_COUNT = 3;
global LOGS_INDEX = 3;

global LOG_ADDRESS_INDEX = 0;
global LOG_TOPICS_INDEX = 1;
global LOG_DATA_INDEX = 2;

struct PhantomMaxLogDataLen<MAX_LOG_DATA_LEN> {}
struct PhantomMaxLogsCount<MAX_LOGS_COUNT> {}

struct Log<MAX_LOG_DATA_LEN> {
    address: Address,
    topics: BoundedVec<Bytes32, MAX_TOPICS_COUNT>,
    data: BoundedVec<u8, MAX_LOG_DATA_LEN>,
}

impl<MAX_LOG_DATA_LEN> Eq for Log<MAX_LOG_DATA_LEN> {
    fn eq(self, other: Self) -> bool {
        (self.address == other.address) &
        (self.topics == other.topics) &
        (self.data == other.data)
    }
}

struct LogWithinBlock<MAX_LOG_DATA_LEN> {
    log: Log<MAX_LOG_DATA_LEN>,
    block_hash: Bytes32
}

struct LogFieldsRlpFragments {
    address: RlpFragment,
    topics: BoundedVec<RlpFragment, MAX_TOPICS_COUNT>,
    data: RlpFragment
}

pub fn get_log<MAX_LOG_DATA_LEN>(_block_number: Field, _tx_idx: Field, _log_idx: Field) -> LogWithinBlock<MAX_LOG_DATA_LEN> {
    assert(false, "Not implemented");
    zeroed()
}

pub(crate) fn extract_log<MAX_LOG_DATA_LEN, MAX_LOGS_COUNT>(
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH],
    log_idx: u64,
    phantom_max_log_data_len: PhantomMaxLogDataLen<MAX_LOG_DATA_LEN>,
    phantom_max_logs_count: PhantomMaxLogsCount<MAX_LOGS_COUNT>
) -> Log<MAX_LOG_DATA_LEN> {
    let log_fragment = extract_log_fragment(receipt_rlp, log_idx, phantom_max_logs_count);
    let log_fields_rlp_fragments = extract_log_fields_fragments(log_fragment);
    convert_to_log(
        receipt_rlp,
        log_fields_rlp_fragments,
        phantom_max_log_data_len
    )
}

fn extract_log_fragment<MAX_LOGS_COUNT>(
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH],
    log_idx: u64,
    _phantom_max_logs_count: PhantomMaxLogsCount<MAX_LOGS_COUNT>
) -> Fragment<MAX_RECEIPT_RLP_LENGTH, u8> {
    let receipt_rlp_fragment = Fragment::from_array(receipt_rlp);

    let receipt_rlp_list: RlpList<RECEIPT_FIELDS_COUNT> = decode_list(receipt_rlp_fragment);
    assert(receipt_rlp_list.len == RECEIPT_FIELDS_COUNT, "Invalid receipt fields count");

    let logs_rlp_fragment = receipt_rlp_list.get(LOGS_INDEX);
    let logs_fragment = receipt_rlp_fragment.subfragment(logs_rlp_fragment.offset, logs_rlp_fragment.length);

    let logs_rlp_list: RlpList<MAX_LOGS_COUNT> = decode_list(logs_fragment);
    assert(logs_rlp_list.len > log_idx, "Log index out of bounds");
    let log_rlp_fragment = logs_rlp_list.storage[log_idx];
    logs_fragment.subfragment(log_rlp_fragment.offset, log_rlp_fragment.length)
}

fn extract_log_fields_fragments(log_fragment: Fragment<MAX_RECEIPT_RLP_LENGTH, u8>) -> LogFieldsRlpFragments {
    let log_values_rlp_list: RlpList<LOG_FIELDS_COUNT> = decode_list(log_fragment);
    assert(log_values_rlp_list.len == LOG_FIELDS_COUNT, "Invalid log fields count");

    let address = log_values_rlp_list.get(LOG_ADDRESS_INDEX).shift(log_fragment.offset);

    let topics_rlp_fragment = log_values_rlp_list.get(LOG_TOPICS_INDEX);
    let topics_fragment = log_fragment.subfragment(topics_rlp_fragment.offset, topics_rlp_fragment.length);

    let topics_rlp_list: RlpList<MAX_TOPICS_COUNT> = decode_list(topics_fragment);
    let mut topics: BoundedVec<RlpFragment, MAX_TOPICS_COUNT> = BoundedVec::new();
    for i in 0..MAX_TOPICS_COUNT {
        if (i < topics_rlp_list.len) {
            let topic = topics_rlp_list.get(i).shift(topics_fragment.offset);
            topics.push(topic);
        }
    }

    let data = log_values_rlp_list.get(LOG_DATA_INDEX).shift(log_fragment.offset);

    LogFieldsRlpFragments { address, topics, data }
}

fn convert_to_log<MAX_LOG_DATA_LEN>(
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH],
    log_fields_rlp_fragments: LogFieldsRlpFragments,
    _phantom_max_log_data_len: PhantomMaxLogDataLen<MAX_LOG_DATA_LEN>
) -> Log<MAX_LOG_DATA_LEN> {
    let address: Address = subarray_inferred_len(receipt_rlp, log_fields_rlp_fragments.address.offset);
    let mut topics: BoundedVec<Bytes32, MAX_TOPICS_COUNT> = BoundedVec::new();
    for i in 0..MAX_TOPICS_COUNT {
        if (i < log_fields_rlp_fragments.topics.len) {
            let topic: Bytes32 = subarray_inferred_len(receipt_rlp, log_fields_rlp_fragments.topics.get(i).offset);
            topics.push(topic);
        }
    }
    assert(log_fields_rlp_fragments.data.length <= MAX_LOG_DATA_LEN, "Log data too long");
    let mut data: BoundedVec<u8, MAX_LOG_DATA_LEN> = BoundedVec::new();
    for i in 0..MAX_LOG_DATA_LEN {
        if i < log_fields_rlp_fragments.data.length {
            data.push(receipt_rlp[log_fields_rlp_fragments.data.offset + i]);
        }
    }
    Log { address, topics, data }
}

use crate::{
    misc::{
    types::{Address, Bytes32}, fragment::Fragment, arrays::subarray_inferred_len,
    bounded_vecs::bounded_vec_map
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

type ReceiptFragment = Fragment<524, u8>;

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

pub fn get_log<MAX_LOG_DATA_LEN>(_block_number: Field, _tx_idx: Field, _log_idx: Field) -> LogWithinBlock<MAX_LOG_DATA_LEN> {
    assert(false, "Not implemented");
    zeroed()
}

pub(crate) fn extract_log<MAX_LOG_DATA_LEN, MAX_LOGS_COUNT>(
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH],
    log_idx: u64,
    phantom_max_logs_count: PhantomMaxLogsCount<MAX_LOGS_COUNT>
) -> Log<MAX_LOG_DATA_LEN> {
    let logs_fragment = extract_logs_fragment(receipt_rlp);
    let log_fragment = extract_log_fragment(logs_fragment, log_idx, phantom_max_logs_count);
    let (address, topics, data) = extract_log_fields_fragments(log_fragment);

    Log {
        address: address.to_array(),
        topics: bounded_vec_map(topics, Fragment::to_array),
        data: data.to_bounded_vec()
    }
}

fn extract_logs_fragment(receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH]) -> Fragment<MAX_RECEIPT_RLP_LENGTH, u8> {
    let receipt_rlp_fragment = Fragment::from_array(receipt_rlp);
    let receipt_rlp_list: RlpList<RECEIPT_FIELDS_COUNT> = decode_list(receipt_rlp_fragment);
    assert(receipt_rlp_list.len == RECEIPT_FIELDS_COUNT, "Invalid receipt fields count");
    rlp_list_subfragment(receipt_rlp_fragment, receipt_rlp_list, LOGS_INDEX)
}

fn extract_log_fragment<MAX_LOGS_COUNT>(
    logs_fragment: Fragment<MAX_RECEIPT_RLP_LENGTH, u8>,
    log_idx: u64,
    _phantom_max_logs_count: PhantomMaxLogsCount<MAX_LOGS_COUNT>
) -> Fragment<MAX_RECEIPT_RLP_LENGTH, u8> {
    let logs_rlp_list: RlpList<MAX_LOGS_COUNT> = decode_list(logs_fragment);
    rlp_list_subfragment(logs_fragment, logs_rlp_list, log_idx)
}

fn extract_log_fields_fragments(log_fragment: Fragment<MAX_RECEIPT_RLP_LENGTH, u8>) -> (ReceiptFragment, BoundedVec<ReceiptFragment, MAX_TOPICS_COUNT>, ReceiptFragment) {
    let log_values_rlp_list: RlpList<LOG_FIELDS_COUNT> = decode_list(log_fragment);
    assert(log_values_rlp_list.len == LOG_FIELDS_COUNT, "Invalid log fields count");

    let address = rlp_list_subfragment(log_fragment, log_values_rlp_list, LOG_ADDRESS_INDEX);

    let topics_fragment = rlp_list_subfragment(log_fragment, log_values_rlp_list, LOG_TOPICS_INDEX);
    let topics_rlp_list: RlpList<MAX_TOPICS_COUNT> = decode_list(topics_fragment);
    let topics = bounded_vec_map(
        topics_rlp_list,
        |topic_rlp_fragment: RlpFragment| topics_fragment.subfragment(topic_rlp_fragment.offset, topic_rlp_fragment.length)
    );

    let data = rlp_list_subfragment(log_fragment, log_values_rlp_list, LOG_DATA_INDEX);

    (address, topics, data)
}

fn rlp_list_subfragment<MAX_FIELDS, N>(fragment: Fragment<N, u8>, rlp_list: RlpList<MAX_FIELDS>, idx: u64) -> Fragment<N, u8> {
    let RlpFragment { offset, length, data_type: _ } = rlp_list.get(idx);
    fragment.subfragment(offset, length)
}

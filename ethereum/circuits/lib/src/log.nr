use crate::{
    misc::{
    types::{Address, Bytes32}, fragment::Fragment, arrays::subarray_inferred_len,
    bounded_vecs::bounded_vec_map
},
    rlp::{decode::decode_list, types::{RlpList, RlpFragment}},
    verifiers::receipt::rlp::RECEIPT_FIELDS_COUNT, receipt::LEGACY_MAX_RECEIPT_RLP_LENGTH
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

type ReceiptFragment = Fragment<LEGACY_MAX_RECEIPT_RLP_LENGTH, u8>;

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
    receipt_rlp: [u8; LEGACY_MAX_RECEIPT_RLP_LENGTH],
    log_idx: u64,
    phantom_max_logs_count: PhantomMaxLogsCount<MAX_LOGS_COUNT>
) -> Log<MAX_LOG_DATA_LEN> {
    let receipt_rlp_fragment = Fragment::from_array(receipt_rlp);
    let logs_fragment = extract_logs_fragment(receipt_rlp_fragment);
    let log_fragment = extract_log_fragment::<MAX_LOGS_COUNT>(logs_fragment, log_idx);

    let log_values_rlp_list: RlpList<LOG_FIELDS_COUNT> = decode_list(log_fragment);
    assert(log_values_rlp_list.len == LOG_FIELDS_COUNT, "Invalid log fields count");

    let address = extract_address(log_fragment, log_values_rlp_list).to_array();
    let topics = bounded_vec_map(
        extract_topics(log_fragment, log_values_rlp_list),
        Fragment::to_array
    );
    let data = extract_data(log_fragment, log_values_rlp_list).to_bounded_vec();

    Log { address, topics, data }
}

fn extract_logs_fragment(receipt_rlp_fragment: ReceiptFragment) -> ReceiptFragment {
    let receipt_rlp_list: RlpList<RECEIPT_FIELDS_COUNT> = decode_list(receipt_rlp_fragment);
    assert(receipt_rlp_list.len == RECEIPT_FIELDS_COUNT, "Invalid receipt fields count");
    rlp_subfragment(receipt_rlp_fragment, receipt_rlp_list.get(LOGS_INDEX))
}

fn extract_log_fragment<MAX_LOGS_COUNT>(logs_fragment: ReceiptFragment, log_idx: u64) -> ReceiptFragment {
    let logs_rlp_list = decode_list::<MAX_RECEIPT_RLP_LENGTH, MAX_LOGS_COUNT>(logs_fragment);
    rlp_subfragment::<MAX_LOGS_COUNT, MAX_RECEIPT_RLP_LENGTH>(logs_fragment, logs_rlp_list.get(log_idx))
}

fn extract_address(
    log_fragment: ReceiptFragment,
    log_values_rlp_list: RlpList<LOG_FIELDS_COUNT>
) -> ReceiptFragment {
    rlp_subfragment(log_fragment, log_values_rlp_list.get(LOG_ADDRESS_INDEX))
}

fn extract_topics(
    log_fragment: ReceiptFragment,
    log_values_rlp_list: RlpList<LOG_FIELDS_COUNT>
) -> BoundedVec<ReceiptFragment, MAX_TOPICS_COUNT> {
    let topics_fragment = rlp_subfragment(log_fragment, log_values_rlp_list.get(LOG_TOPICS_INDEX));
    let topics_rlp_list: RlpList<MAX_TOPICS_COUNT> = decode_list(topics_fragment);
    bounded_vec_map(
        topics_rlp_list,
        |topic_rlp_fragment| rlp_subfragment(topics_fragment, topic_rlp_fragment)
    )
}

fn extract_data(log_fragment: ReceiptFragment, log_values_rlp_list: RlpList<LOG_FIELDS_COUNT>) -> ReceiptFragment {
    rlp_subfragment(log_fragment, log_values_rlp_list.get(LOG_DATA_INDEX))
}

fn rlp_subfragment<MAX_FIELDS, N>(fragment: Fragment<N, u8>, rlp_fragment: RlpFragment) -> Fragment<N, u8> {
    let RlpFragment { offset, length, data_type: _ } = rlp_fragment;
    fragment.subfragment(offset, length)
}

use crate::{
    misc::{types::{Address, Bytes32}, fragment::Fragment, bounded_vecs::bounded_vec_map},
    rlp::{decode::decode_list, types::{RlpList, RlpFragment}},
    verifiers::receipt::{rlp::RECEIPT_FIELDS_COUNT, verify_receipt},
    receipt::{
    receipt_rlp_from_proof, get_receipt_unconstrained_M, TxType, TxReceiptPartial, ProofInput,
    MAX_RECEIPT_RLP_LEN_M, MAX_RECEIPT_ENCODED_LEN_M, MAX_PREFIXED_KEY_NIBBLE_LEN, MAX_VALUE_LEN_M,
    MAX_DEPTH_NO_LEAF, MAX_LEAF_LEN_M
},
    header::get_header
};
use dep::std::unsafe::zeroed;

global MAX_TOPICS_COUNT = 4;
global LOG_FIELDS_COUNT = 3;
global LOGS_INDEX = 3;

global LOG_ADDRESS_INDEX = 0;
global LOG_TOPICS_INDEX = 1;
global LOG_DATA_INDEX = 2;

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

pub fn get_log<MAX_LOG_DATA_LEN, MAX_LOGS_COUNT>(
    chain_id: Field,
    block_number: u64,
    tx_idx: Field,
    log_idx: u64
) -> LogWithinBlock<MAX_LOG_DATA_LEN> {
    let (tx_type, receipt, receipt_proof_input): (TxType, TxReceiptPartial, ProofInput<MAX_PREFIXED_KEY_NIBBLE_LEN, MAX_VALUE_LEN_M, MAX_DEPTH_NO_LEAF, MAX_LEAF_LEN_M>) = get_receipt_unconstrained_M(chain_id, block_number, tx_idx);

    let header = get_header(chain_id, block_number);

    verify_receipt(
        block_number,
        tx_idx,
        tx_type,
        receipt,
        receipt_proof_input,
        header.receipts_root
    );

    let receipt_rlp = receipt_rlp_from_proof(tx_type, receipt_proof_input);
    let log = extract_log::<MAX_LOG_DATA_LEN, MAX_LOGS_COUNT, MAX_VALUE_LEN_M>(receipt_rlp, log_idx);

    LogWithinBlock { log, block_hash: header.hash }
}

pub(crate) fn extract_log<MAX_LOG_DATA_LEN, MAX_LOGS_COUNT, MAX_RECEIPT_RLP_FRAGMENT_LEN>(
    receipt_rlp_fragment: Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8> ,
    log_idx: u64
) -> Log<MAX_LOG_DATA_LEN> {
    let logs_fragment = extract_logs_fragment(receipt_rlp_fragment);
    let log_fragment = extract_log_fragment::<MAX_LOGS_COUNT, MAX_RECEIPT_RLP_FRAGMENT_LEN>(logs_fragment, log_idx);

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

fn extract_logs_fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN>(receipt_rlp_fragment: Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8>) -> Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8> {
    let receipt_rlp_list: RlpList<RECEIPT_FIELDS_COUNT> = decode_list(receipt_rlp_fragment);
    assert(receipt_rlp_list.len == RECEIPT_FIELDS_COUNT, "Invalid receipt fields count");
    rlp_subfragment(receipt_rlp_fragment, receipt_rlp_list.get(LOGS_INDEX))
}

fn extract_log_fragment<MAX_LOGS_COUNT, MAX_RECEIPT_RLP_FRAGMENT_LEN>(
    logs_fragment: Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8>,
    log_idx: u64
) -> Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8> {
    let logs_rlp_list: RlpList<MAX_LOGS_COUNT> = decode_list(logs_fragment);
    rlp_subfragment(logs_fragment, logs_rlp_list.get(log_idx))
}

fn extract_address<MAX_RECEIPT_RLP_FRAGMENT_LEN>(
    log_fragment: Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8> ,
    log_values_rlp_list: RlpList<LOG_FIELDS_COUNT>
) -> Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8> {
    rlp_subfragment(log_fragment, log_values_rlp_list.get(LOG_ADDRESS_INDEX))
}

fn extract_topics<MAX_RECEIPT_RLP_FRAGMENT_LEN>(
    log_fragment: Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8> ,
    log_values_rlp_list: RlpList<LOG_FIELDS_COUNT>
) -> BoundedVec<Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8> , MAX_TOPICS_COUNT> {
    let topics_fragment = rlp_subfragment(log_fragment, log_values_rlp_list.get(LOG_TOPICS_INDEX));
    let topics_rlp_list: RlpList<MAX_TOPICS_COUNT> = decode_list(topics_fragment);
    bounded_vec_map(
        topics_rlp_list,
        |topic_rlp_fragment| rlp_subfragment(topics_fragment, topic_rlp_fragment)
    )
}

fn extract_data<MAX_RECEIPT_RLP_FRAGMENT_LEN>(
    log_fragment: Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8> ,
    log_values_rlp_list: RlpList<LOG_FIELDS_COUNT>
) -> Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8> {
    rlp_subfragment(log_fragment, log_values_rlp_list.get(LOG_DATA_INDEX))
}

fn rlp_subfragment<MAX_RECEIPT_RLP_FRAGMENT_LEN>(
    fragment: Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8>,
    rlp_fragment: RlpFragment
) -> Fragment<MAX_RECEIPT_RLP_FRAGMENT_LEN, u8> {
    let RlpFragment { offset, length, data_type: _ } = rlp_fragment;
    fragment.subfragment(offset, length)
}

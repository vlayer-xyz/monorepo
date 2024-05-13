use crate::{
    verifiers::receipt::{MAX_RECEIPT_RLP_LENGTH, is_pre_byzantium},
    receipt::{BLOOM_FILTER_LEN, TxReceiptPartial}, log::{Log, MAX_TOPICS_COUNT, MAX_LOGS_COUNT},
    misc::{fragment::Fragment, types::{ADDRESS_LENGTH, BYTES32_LENGTH}},
    rlp::{decode::decode_list, types::{RlpList, RlpFragment}}
};

global RECEIPT_FIELDS_COUNT = 4;
global LOG_FIELDS_COUNT = 3;
global STATE_ROOT_INDEX = 0;
global STATUS_INDEX = 0;
global CUMULATIVE_GAS_USED_INDEX = 1;
global LOGS_BLOOM_INDEX = 2;
global LOGS_INDEX = 3;

global LOGS_ADDRESS_INDEX = 0;
global LOGS_TOPICS_INDEX = 1;
global LOGS_DATA_INDEX = 2;

pub(crate) fn assert_receipt_rlp_equals(
    is_pre_byzantium: bool,
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH],
    receipt: TxReceiptPartial
) {
    let receipt_rlp_list: RlpList<RECEIPT_FIELDS_COUNT> = decode_list(Fragment::from_array(receipt_rlp));
    assert(receipt_rlp_list.len == RECEIPT_FIELDS_COUNT, "Invalid number of fields in receipt RLP");

    if (is_pre_byzantium) {
        receipt_rlp_list.get(STATE_ROOT_INDEX).assert_eq_bytes32(
            "State root",
            receipt_rlp,
            receipt.state_root.expect(f"State root is missing")
        );
    } else {
        receipt_rlp_list.get(STATUS_INDEX).assert_eq_u1(
            "Status",
            receipt_rlp,
            receipt.status.expect(f"Status is missing")
        );
    }

    receipt_rlp_list.get(CUMULATIVE_GAS_USED_INDEX).assert_eq_u32(
        "Cumulative gas used",
        receipt_rlp,
        receipt.cumulative_gas_used
    );

    receipt_rlp_list.get(LOGS_BLOOM_INDEX).assert_eq_bytes("Logs bloom", receipt_rlp, receipt.logs_bloom, BLOOM_FILTER_LEN);
}

pub(crate) fn assert_log_rlp_equals<MAX_LOG_DATA_LEN>(
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH],
    log_idx: u64,
    log: Log<MAX_LOG_DATA_LEN>
) {
    let log_fragment = extract_log_fragment(receipt_rlp, log_idx);
    let log_values_rlp_list: RlpList<LOG_FIELDS_COUNT> = decode_list(log_fragment);

    let address = log_values_rlp_list.get(LOGS_ADDRESS_INDEX).shift(log_fragment.offset);
    address.assert_eq_bytes("Address", receipt_rlp, log.address, ADDRESS_LENGTH);

    let topics_rlp_fragment = log_values_rlp_list.get(LOGS_TOPICS_INDEX);
    let topics_fragment = log_fragment.subfragment(topics_rlp_fragment.offset, topics_rlp_fragment.length);

    let topics_rlp_list: RlpList<MAX_TOPICS_COUNT> = decode_list(topics_fragment);
    assert(topics_rlp_list.len == log.topics.len, "Invalid number of topics in log RLP");
    for i in 0..MAX_TOPICS_COUNT {
        if (i < topics_rlp_list.len) {
            let topic = topics_rlp_list.get(i).shift(topics_fragment.offset);
            topic.assert_eq_bytes("Topic", receipt_rlp, log.topics.storage[i], BYTES32_LENGTH);
        }
    }

    let data = log_values_rlp_list.get(LOGS_DATA_INDEX).shift(log_fragment.offset);
    data.assert_eq_bounded_vec("Data", receipt_rlp, log.data);
}

fn extract_log_fragment(
    receipt_rlp: [u8; MAX_RECEIPT_RLP_LENGTH],
    log_idx: u64
) -> Fragment<MAX_RECEIPT_RLP_LENGTH, u8> {
    let receipt_rlp_fragment = Fragment::from_array(receipt_rlp);

    let receipt_rlp_list: RlpList<RECEIPT_FIELDS_COUNT> = decode_list(receipt_rlp_fragment);
    let logs_rlp_fragment = receipt_rlp_list.get(LOGS_INDEX);
    let logs_fragment = receipt_rlp_fragment.subfragment(logs_rlp_fragment.offset, logs_rlp_fragment.length);

    let logs_rlp_list: RlpList<MAX_LOGS_COUNT> = decode_list(logs_fragment);
    assert(logs_rlp_list.len > log_idx, "Log index out of bounds");
    let log_rlp_fragment = logs_rlp_list.storage[log_idx];
    logs_fragment.subfragment(log_rlp_fragment.offset, log_rlp_fragment.length)
}

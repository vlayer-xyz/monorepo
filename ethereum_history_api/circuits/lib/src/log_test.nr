mod extract_log {
    use crate::fixtures::mainnet::{
        cancun::{
        small_block::{receipt::receipt_rlp as small_block_receipt_rlp, log::log as small_block_log},
        approve::{receipt::receipt_rlp as approve_receipt_rlp, log::log as approve_log}
    }
    };
    use crate::log::{extract_log, PhantomMaxLogDataLen};
    use crate::misc::arrays::sub_array_equals_up_to_length;

    global phantom_max_log_data_len: PhantomMaxLogDataLen<32> = PhantomMaxLogDataLen {};

    #[test]
    fn success_small_block() {
        let log = extract_log(small_block_receipt_rlp, 0, phantom_max_log_data_len);
        assert_eq(log, small_block_log);
    }

    #[test]
    fn success_approve() {
        let log = extract_log(approve_receipt_rlp, 0, phantom_max_log_data_len);
        assert_eq(log, approve_log);
    }

    #[test]
    fn big_max_log_data_len() {
        let big_phantom_max_log_data_len: PhantomMaxLogDataLen<100> = PhantomMaxLogDataLen {};
        let log = extract_log(small_block_receipt_rlp, 0, big_phantom_max_log_data_len);
        assert_eq(log.address, small_block_log.address);
        assert_eq(log.topics, small_block_log.topics);
        assert_eq(log.data.len(), small_block_log.data.len());
        assert(
            sub_array_equals_up_to_length(
                small_block_log.data.storage,
                log.data.storage,
                0,
                log.data.len()
            )
        );
    }

    #[test(should_fail_with="Log index out of bounds")]
    fn index_out_of_bound() {
        let _ = extract_log(small_block_receipt_rlp, 1, phantom_max_log_data_len);
    }

    #[test(should_fail_with="Log data too long")]
    fn log_data_too_long() {
        let small_phantom_max_log_data_len: PhantomMaxLogDataLen<1> = PhantomMaxLogDataLen {};
        let _ = extract_log(small_block_receipt_rlp, 0, small_phantom_max_log_data_len);
    }
}

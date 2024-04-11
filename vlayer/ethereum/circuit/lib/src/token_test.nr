mod test_storage_value_to_balance {
    use crate::token::storage_value_to_balance;

    #[test]
    fn success_zero() {
        let balance = storage_value_to_balance([0; 32]);
        assert_eq(balance, 0);
    }

    #[test]
    fn success_one() {
        let balance = storage_value_to_balance(
            [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1
        ]
        );
        assert_eq(balance, 1);
    }

    #[test]
    fn success_medium() {
        let balance = storage_value_to_balance(
            [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xab, 0xcd, 0xef, 0x01, 0x23, 0x45, 0x67, 0x89
        ]
        );
        assert_eq(balance, 0xabcdef0123456789);
    }
    #[test(should_fail_with="Value exceeds the maximum limit for conversion to the specified Field type.")]
    fn fail_to_big() {
        let _ = storage_value_to_balance([0xff; 32]);
    }
}

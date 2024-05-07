mod account_serialize {
    use crate::account_with_storage::{Account, ACCOUNT_SERIALIZED_LEN};
    use crate::misc::arrays::sub_array_equals;
    use crate::fixtures::mainnet::london::vitalik_balance::account::account;

    #[test]
    fn simple() {
        let serialized: [Field; ACCOUNT_SERIALIZED_LEN] = account.serialize();

        assert_eq(serialized[0], account.nonce as Field);
        assert_eq(serialized[1], account.balance);
        assert(sub_array_equals(account.storage_root.serialize(), serialized, 2));
        assert(sub_array_equals(account.code_hash.serialize(), serialized, 34));
    }
}

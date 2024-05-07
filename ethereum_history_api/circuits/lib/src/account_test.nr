mod account_within_block_serialize {
    use crate::account_with_storage::ACCOUNT_SERIALIZED_LEN;
    use crate::account::{AccountWithinBlock, ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN};
    use crate::fixtures::mainnet::london::vitalik_balance::{account::account, header::hash};
    use crate::misc::arrays::sub_array_equals;

    #[test]
    fn simple() {
        let account_within_block = AccountWithinBlock { account, block_hash: hash };
        let serialized: [Field; ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN] = account_within_block.serialize();

        assert(sub_array_equals(account_within_block.account.serialize(), serialized, 0));
        assert(
            sub_array_equals(
                account_within_block.block_hash.serialize(),
                serialized,
                ACCOUNT_SERIALIZED_LEN
            )
        );
    }
}

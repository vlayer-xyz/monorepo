mod U128_ {

    use crate::serialize::U128_SERIALIZED_LEN;

    #[test]
    fn simple() {
        let value = U128::from_integer(100);
        let serialized: [Field; U128_SERIALIZED_LEN] = value.serialize();

        assert_eq(serialized[0], value.lo);
        assert_eq(serialized[1], value.hi);
    }
}

mod bytes32 {
    use crate::misc::types::{Bytes32, BYTES32_LENGTH};

    #[test]
    fn simple() {
        let bytes: Bytes32 = [1; BYTES32_LENGTH];
        let serialized: [Field; BYTES32_LENGTH] = bytes.serialize();
        let expected: [Field; BYTES32_LENGTH] = [1; BYTES32_LENGTH];
        assert_eq(serialized, expected);
    }
}

mod account {
    use crate::account_with_storage::Account;
    use crate::serialize::ACCOUNT_SERIALIZED_LEN;
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

mod account_within_block {
    use crate::serialize::{ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN, ACCOUNT_SERIALIZED_LEN};
    use crate::account::AccountWithinBlock;
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

mod storage_within_block {
    use crate::serialize::{STORAGE_WITHIN_BLOCK_1_SERIALIZED_LEN, ACCOUNT_SERIALIZED_LEN};
    use crate::account_with_storage::StorageWithinBlock;
    use crate::fixtures::mainnet::paris::usdc_circle::{account::account, header::hash, storage_proof_new::proofs};
    use crate::misc::{types::BYTES32_LENGTH, arrays::sub_array_equals};

    #[test]
    fn simple() {
        let value = proofs[0].value;
        let storage_within_block = StorageWithinBlock { block_hash: hash, account, values: [value] };
        let serialized: [Field; STORAGE_WITHIN_BLOCK_1_SERIALIZED_LEN] = storage_within_block.serialize();

        assert(sub_array_equals(storage_within_block.block_hash.serialize(), serialized, 0));
        assert(
            sub_array_equals(
                storage_within_block.account.serialize(),
                serialized,
                BYTES32_LENGTH
            )
        );
        assert(sub_array_equals(storage_within_block.values[0].serialize(), serialized, BYTES32_LENGTH + ACCOUNT_SERIALIZED_LEN));
    }
}

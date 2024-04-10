mod test_get_token_balance_internal {
    use crate::token::get_token_balance_internal;
    use dep::ethereum_history_api::{
        account_with_storage::{get_account_with_storage, StorageWithinBlock, Account},
        misc::types::{Address, Bytes32}
    };

    global TEST_BYTES32: Bytes32 = [0; 32];

    global TEST_ACCOUNT: Account = Account {
        nonce: 1,
        balance: 1,
        storage_root: TEST_BYTES32,
        code_hash: TEST_BYTES32,
    };

    global TEST_STORAGE_WITHIN_BLOCK: StorageWithinBlock<1> = StorageWithinBlock { block_hash: TEST_BYTES32, account: TEST_ACCOUNT, values:[TEST_BYTES32]};

    #[test]
    fn success() {
        let mock_calculate_token_balance_storage_key = |_token_address, _wallet_address| TEST_BYTES32;
        let mock_get_account_with_storage = |_block_number, _token_address, _storage_key| TEST_STORAGE_WITHIN_BLOCK;
        let mock_storage_value_to_balance = |_storage_value| 1;

        let balance = get_token_balance_internal(
            [0; 20],
            [0; 20],
            1,
            mock_calculate_token_balance_storage_key,
            mock_get_account_with_storage,
            mock_storage_value_to_balance
        );
        assert_eq(balance, 1);
    }
}

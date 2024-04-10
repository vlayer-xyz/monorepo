use dep::ethereum_history_api::{account_with_storage::{get_account_with_storage, StorageWithinBlock}, misc::types::{Address, Bytes32}};
use dep::std::unsafe::zeroed;

global TOKEN_BALANCE_INDEX = 0;

pub fn get_token_balance(token_address: Address, wallet_address: Address, block_number: Field) -> Field {
    get_token_balance_internal(
        token_address,
        wallet_address,
        block_number,
        calculate_token_balance_storage_key,
        get_account_with_storage,
        storage_value_to_balance
    )
}

pub(crate) fn get_token_balance_internal(
    token_address: Address,
    wallet_address: Address,
    block_number: Field,
    _calculate_token_balance_storage_key: fn(Address, Address) -> Bytes32,
    _get_account_with_storage: fn(Field, Address, Bytes32) -> StorageWithinBlock<1>,
    _storage_value_to_balance: fn(Bytes32) -> Field
) -> Field {
    let storage_key = _calculate_token_balance_storage_key(token_address, wallet_address);
    let account = _get_account_with_storage(block_number, token_address, storage_key);
    let balance = account.values[TOKEN_BALANCE_INDEX];

    _storage_value_to_balance(balance)
}

pub fn calculate_token_balance_storage_key(_token_address: Address, _address: Address) -> Bytes32 {
    assert(false, "Not implemented");
    zeroed()
}

fn storage_value_to_balance(_bytes: Bytes32) -> Field {
    assert(false, "Not implemented");
    zeroed()
}

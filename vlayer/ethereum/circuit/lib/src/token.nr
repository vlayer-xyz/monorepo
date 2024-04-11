use dep::ethereum_history_api::{account_with_storage::{get_account_with_storage, StorageWithinBlock}, misc::types::{Address, Bytes32}};
use dep::std::unsafe::zeroed;

global TOKEN_BALANCE_INDEX = 0;

pub fn get_token_balance(token_address: Address, wallet_address: Address, block_number: Field) -> U128 {
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
    calculate_token_balance_storage_key_param: fn(Address, Address) -> Bytes32,
    get_account_with_storage_param: fn(Field, Address, Bytes32) -> StorageWithinBlock<1>,
    storage_value_to_balance_param: fn(Bytes32) -> U128
) -> U128 {
    let storage_key = calculate_token_balance_storage_key_param(token_address, wallet_address);
    let account = get_account_with_storage_param(block_number, token_address, storage_key);
    let balance = account.values[TOKEN_BALANCE_INDEX];

    storage_value_to_balance_param(balance)
}

pub fn calculate_token_balance_storage_key(token_address: Address, wallet_address: Address) -> Bytes32 {
    assert(false, "Not implemented");
    zeroed()
}

fn storage_value_to_balance(bytes: Bytes32) -> U128 {
    assert(false, "Not implemented");
    zeroed()
}

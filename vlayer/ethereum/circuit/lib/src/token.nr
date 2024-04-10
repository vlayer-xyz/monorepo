use dep::ethereum_history_api::{account_with_storage::get_account_with_storage, misc::types::{Address, Bytes32}};
use dep::std::unsafe::zeroed;

global TOKEN_BALANCE_INDEX = 0;

pub fn get_token_balance(token_address: Address, address: Address, block_number: Field) -> Field {
    let storage_key = calculate_token_balance_storage_key(token_address, address);
    let account = get_account_with_storage(block_number, token_address, storage_key);
    let balance = account.values[TOKEN_BALANCE_INDEX];

    storage_value_to_balance(balance)
}

pub fn calculate_token_balance_storage_key(_token_address: Address, _address: Address) -> Bytes32 {
    assert(false, "Not implemented");
    zeroed()
}

fn storage_value_to_balance(_bytes: Bytes32) -> Field {
    assert(false, "Not implemented");
    zeroed()
}

use dep::ethereum_history_api::{account_with_storage::{get_account_with_storage, StorageWithinBlock}, misc::types::{Address, Bytes32}};
use dep::std::unsafe::zeroed;

global TOKEN_BALANCE_INDEX = 0;

fn to_field(bytes: Bytes32) -> Field {
    bytes.fold(0, |acc, byte: u8| acc * 0xff + (byte as Field))
}

fn calculate_storage_key(_token_address: Address, _address: Address) -> Bytes32 {
    assert(false, "Not implemented");
    zeroed()
}

fn get_token_balance(token_address: Address, address: Address, block_number: Field) -> Field {
    let storage_key = calculate_storage_key(token_address, address);
    let account = get_account_with_storage(block_number, token_address, storage_key);
    let balance = account.values[TOKEN_BALANCE_INDEX];

    to_field(balance)
}

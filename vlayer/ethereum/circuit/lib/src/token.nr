use dep::ethereum_history_api::{account_with_storage::{get_account_with_storage, StorageWithinBlock}, misc::types::{Address, Bytes32}};
use dep::std::{unsafe::zeroed, field::bytes32_to_field};

global TOKEN_BALANCE_INDEX = 0;

struct Erc20Token {
    address: Address,
    balances_slot: Field,
    chain_id: Field
}

impl Erc20Token {
    fn calculate_balance_storage_key(self, wallet_address: Address) -> Bytes32 {
        assert(false, "Not implemented");
        zeroed()
    }
}

trait TokenApi {
    fn get_balance(self, wallet_address: Address, block_number: Field) -> Field ;
}

impl TokenApi for Erc20Token {
    fn get_balance(self, wallet_address: Address, block_number: Field) -> Field {
        let storage_key = self.calculate_balance_storage_key(wallet_address);
        let account = get_account_with_storage(block_number, self.address, storage_key);
        let balance = account.values[TOKEN_BALANCE_INDEX];

        bytes32_to_field(balance)
    }
}

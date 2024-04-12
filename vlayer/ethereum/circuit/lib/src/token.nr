use dep::ethereum_history_api::{account_with_storage::get_account_with_storage, misc::types::{Address, Bytes32}};
use dep::std::field::bytes32_to_field;
use crate::storage_key::calculate_mapping_address_storage_key;

global TOKEN_BALANCE_INDEX = 0;

struct ERC20Token {
    address: Address,
    balances_slot: Field,
    chain_id: Field
}

impl ERC20Token {
    fn calculate_balance_storage_key(self, wallet_address: Address) -> Bytes32 {
        calculate_mapping_address_storage_key(self.balances_slot, wallet_address)
    }
}

trait ERC20 {
    fn get_balance(self, wallet_address: Address, block_number: Field) -> Field ;
}

impl ERC20 for ERC20Token {
    fn get_balance(self, wallet_address: Address, block_number: Field) -> Field {
        let storage_key = self.calculate_balance_storage_key(wallet_address);
        let account = get_account_with_storage(block_number, self.address, storage_key);
        let balance = account.values[TOKEN_BALANCE_INDEX];

        bytes32_to_field(balance)
    }
}

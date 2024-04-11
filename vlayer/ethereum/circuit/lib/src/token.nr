use dep::ethereum_history_api::{
    account_with_storage::{get_account_with_storage, StorageWithinBlock},
    misc::types::{Address, Bytes32, ADDRESS_LENGTH, BYTES32_LENGTH}
};
use dep::std::{unsafe::zeroed, field::bytes32_to_field};
use dep::std::hash::keccak256;

global TOKEN_BALANCE_INDEX = 0;

struct ERC20Token {
    address: Address,
    balances_slot: Bytes32,
    chain_id: Field
}

impl ERC20Token {
    fn calculate_balance_storage_key(self, wallet_address: Address) -> Bytes32 {
        calculate_balance_storage_key(self.balances_slot, wallet_address)
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

pub(crate) fn calculate_balance_storage_key(balances_slot: Bytes32, wallet_address: Address) -> Bytes32 {
    let mut key = [0; 64];
    for i in 0..ADDRESS_LENGTH {
        key[BYTES32_LENGTH - ADDRESS_LENGTH + i] = wallet_address[i];
    }
    for i in 0..BYTES32_LENGTH {
        key[BYTES32_LENGTH + i] = balances_slot[i];
    }
    keccak256(key, 64)
}

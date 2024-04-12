use dep::ethereum_history_api::{
    account_with_storage::{get_account_with_storage, StorageWithinBlock},
    misc::{types::{Address, Bytes32, ADDRESS_LENGTH, BYTES32_LENGTH}, field::field_to_bytes32}
};
use dep::std::{unsafe::zeroed, field::bytes32_to_field};
use dep::std::hash::keccak256;

global TOKEN_BALANCE_INDEX = 0;
global STORAGE_KEY_HASH_INPUT_LENGTH = 64;

struct ERC20Token {
    address: Address,
    balances_slot: Field,
    chain_id: Field
}

impl ERC20Token {
    fn calculate_balance_storage_key(self, wallet_address: Address) -> Bytes32 {
        let slot = field_to_bytes32(self.balances_slot);
        calculate_balance_storage_key(slot, wallet_address)
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
    let mut vector: BoundedVec<u8, STORAGE_KEY_HASH_INPUT_LENGTH> = BoundedVec::new();
    vector.extend_from_array([0; BYTES32_LENGTH - ADDRESS_LENGTH]);
    vector.extend_from_array(wallet_address);
    vector.extend_from_array(balances_slot);
    keccak256(vector.storage(), STORAGE_KEY_HASH_INPUT_LENGTH)
}

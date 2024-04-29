use dep::ethereum_history_api::{
    account_with_storage::get_account_with_storage,
    misc::types::{Address, Bytes32, ADDRESS_LENGTH, BYTES32_LENGTH}, misc::arrays::subarray_inferred_len
};

struct ERC721Token {
    address: Address,
    token_id_to_slot: fn (Bytes32) -> Bytes32,
    chain_id: Field
}

trait ERC721 {
    fn get_owner(self, token_id: Bytes32, block_number: u64) -> Address;
}

impl ERC721 for ERC721Token {
    fn get_owner(self, token_id: Bytes32, block_number: u64) -> Address {
        let storage_key = (self.token_id_to_slot)(token_id);
        let account = get_account_with_storage(block_number, self.address, storage_key);
        subarray_inferred_len(account.values[0], BYTES32_LENGTH - ADDRESS_LENGTH)
    }
}

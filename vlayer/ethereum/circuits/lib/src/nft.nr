use dep::ethereum::{
    account_with_storage::get_account_with_storage,
    misc::{types::{Address, Bytes32, ADDRESS_LENGTH, BYTES32_LENGTH}, arrays::subarray_inferred_len},
    uint256::U256
};

struct ERC721Token {
    address: Address,
    token_id_to_slot: fn (Bytes32) -> U256,
    chain_id: Field
}

trait ERC721 {
    fn get_owner(self, token_id: Bytes32, block_number: u64) -> Address;
}

impl ERC721 for ERC721Token {
    fn get_owner(self, token_id: Bytes32, block_number: u64) -> Address {
        let storage_key = (self.token_id_to_slot)(token_id);
        let account = get_account_with_storage(self.chain_id, block_number, self.address, U256::into(storage_key));
        subarray_inferred_len(account.values[0], BYTES32_LENGTH - ADDRESS_LENGTH)
    }
}

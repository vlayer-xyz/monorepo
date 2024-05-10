use dep::ethereum_history_api::misc::types::Address;
use dep::token::nft_list::mainnet::CRYPTO_PUNK;
use dep::std::field::bytes32_to_field;
use dep::ethereum_history_api::misc::field::field_to_bytes32;

mod main_test;

fn main(wallet_address: Address, token_id: Field, block_number: pub u64) {
    let owner = CRYPTO_PUNK.get_owner(field_to_bytes32(token_id), block_number);
    assert_eq(owner, wallet_address, "Owner is not the same as the wallet address");
}

use dep::ethereum_history_api::misc::types::Address;
use dep::token::nft_list::mainnet::BORED_APE_YACHT_CLUB;
use dep::std::field::bytes32_to_field;
use dep::ethereum_history_api::misc::field::field_to_bytes32;

mod main_test;

fn main(wallet_address: Address, token_id: [u8; 32], block_number: pub Field) {
    let owner = BORED_APE_YACHT_CLUB.get_owner(token_id, block_number);
    assert_eq(owner, wallet_address, "Owner is not the same as the wallet address");
}

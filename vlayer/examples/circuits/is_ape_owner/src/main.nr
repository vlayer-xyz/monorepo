use dep::ethereum_history_api::misc::types::Address;
use dep::token::nft_list::mainnet::BORED_APE_YACHT_CLUB;
use dep::std::field::bytes32_to_field;
use dep::ethereum_history_api::misc::field::field_to_bytes32;

mod main_test;

global BORED_APE_YACHT_CLUB_MAX_TOKEN_ID: u64 = 9999;

fn main(wallet_address: Address, token_id: [u8; 32], block_number: pub Field) {
    assert(bytes32_to_field(token_id) as u64 <= BORED_APE_YACHT_CLUB_MAX_TOKEN_ID, "Token ID is too high");
    let owner = BORED_APE_YACHT_CLUB.get_owner(token_id, block_number);
    assert_eq(owner, wallet_address, "Owner is not the same as the wallet address");
}

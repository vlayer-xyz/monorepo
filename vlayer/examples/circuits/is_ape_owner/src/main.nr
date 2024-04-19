use dep::ethereum_history_api::misc::types::Address;
use dep::token::nft_list::mainnet::BORED_APE_YACHT_CLUB;
use dep::std::field::bytes32_to_field;
use dep::ethereum_history_api::misc::field::field_to_bytes32;

fn main(wallet_address: Address, block_number: pub Field) {
    let token_id = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7];
    let owner = BORED_APE_YACHT_CLUB.get_owner(token_id, block_number);
    assert_eq(owner, wallet_address, "Owner is not the same as the wallet address");
}

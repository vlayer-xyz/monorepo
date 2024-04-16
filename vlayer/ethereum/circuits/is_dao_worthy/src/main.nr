use dep::ethereum_history_api::misc::types::Address;
use dep::token::token_list::mainnet::USDC;

mod main_test;

fn main(wallet_address: Address, block_number: pub Field, min_balance: pub Field) {
    assert(min_balance.lt(USDC.get_balance(wallet_address, block_number)), "Insufficient USDC balance");
}

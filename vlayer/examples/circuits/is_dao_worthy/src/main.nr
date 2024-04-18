use dep::ethereum_history_api::misc::types::Address;
use dep::token::token_list::mainnet::USDC;

mod main_test;

global MIN_BALANCE = 100_000_000_000; // $100k

fn main(wallet_address: Address, block_number: pub Field) {
    let wallet_balance = USDC.get_balance(wallet_address, block_number);
    let is_balance_greater_or_equal = MIN_BALANCE.lt(wallet_balance) | (MIN_BALANCE == wallet_balance);

    assert(is_balance_greater_or_equal, "Insufficient USDC balance");
}

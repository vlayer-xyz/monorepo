use dep::ethereum_history_api::misc::types::Address;
use dep::token::token_list::mainnet::USDC;

mod main_test;

fn main(wallet_address: Address, block_number: pub Field, min_balance: pub Field) {
    let wallet_balance = USDC.get_balance(wallet_address, block_number);
    let is_balance_greater_or_equal = min_balance.lt(wallet_balance) | (min_balance == wallet_balance);

    assert(is_balance_greater_or_equal, "Insufficient USDC balance");
}

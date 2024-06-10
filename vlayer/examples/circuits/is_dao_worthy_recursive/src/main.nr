use dep::ethereum::misc::types::Address;
use dep::token::token_list::mainnet::USDC;

mod main_test;

global MIN_BALANCE = U128::from_integer(100_000_000_000); // $100k

fn main(wallet_address: Address, block_number: pub u64) {
    let wallet_balance = USDC.get_balance(wallet_address, block_number, true);

    assert(MIN_BALANCE <= wallet_balance, "Insufficient USDC balance");
}

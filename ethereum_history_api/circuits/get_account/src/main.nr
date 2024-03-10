use dep::ethereum_history_api::account::{get_account, AccountWithinBlock};
use dep::ethereum_history_api::misc::types::Address;

fn main(
    block_no: pub Field,
    address: pub Address,
) -> pub AccountWithinBlock {
    get_account(block_no, address)
}

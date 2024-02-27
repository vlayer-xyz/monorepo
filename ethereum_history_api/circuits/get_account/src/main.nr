use dep::ethereum_history_api::account::{get_account, Account};
use dep::ethereum_history_api::header::{get_header, BlockHeaderPartial};
use dep::ethereum_history_api::misc::types::{Address, Bytes32};

fn main(
    block_no: pub Field,
    address: pub Address,
) -> pub (Account, Bytes32) {
    get_account(block_no, address)
}

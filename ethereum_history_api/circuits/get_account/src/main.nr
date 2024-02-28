use dep::ethereum_history_api::account::{get_account, ReturnData};
use dep::ethereum_history_api::misc::types::{Address, Bytes32};

fn main(
    block_no: pub Field,
    address: pub Address,
) -> pub ReturnData {
    get_account(block_no, address)
}

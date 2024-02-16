use dep::ethereum_history_api::account::{verify_account, Account};
use dep::ethereum_history_api::header::{get_header, BlockHeaderPartial};
use dep::ethereum_history_api::misc::types::{Address, Bytes32};

fn main(
    block_no: pub Field,
    address: pub Address,
    // This is marked pub due to an issue in noir JS library. For details - see README.md `Private arguments` section.
    state_root: pub Bytes32
) -> pub Account {
    let account = verify_account(block_no, address, state_root);
    get_header(block_no);
    account
}

mod get_account;
use crate::get_account::{get_account, Dupa};

fn main(block_no: pub Field) {
    let account = get_account(18800000, "0xe9c3123e4cf348c66b20a985af264891fc0a441a");
    assert(account.codeHash == 0);
}

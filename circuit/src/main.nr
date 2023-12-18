fn main(block_no: pub Field) {
    let account = get_account(18800000, "0xe9c3123e4cf348c66b20a985af264891fc0a441a");
    assert(account == block_no);
}

#[oracle(get_account)]
unconstrained fn get_account_oracle(block_no: Field, account: str<42>) -> Field {}

unconstrained fn get_account(block_no: Field, account: str<42>) -> Field {
    get_account_oracle(block_no, account)
}

/// TODO: Use mocks
// #[test]
// fn test_main() {
//     main(1);
// }

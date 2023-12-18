fn main(x: Field, y: pub Field) {
    let account = get_account(18800000, "0xe9c3123e4cf348c66b20a985af264891fc0a441a");
    assert(x != y);
}

#[oracle(get_account)]
unconstrained fn get_account_oracle(block_no: Field, account: str<42>) -> Field {}

unconstrained fn get_account(block_no: Field, account: str<42>) -> Field {
    get_account_oracle(block_no, account)
}

#[test]
fn test_main() {
    main(1, 2);
}

struct Account {
    balance: Field,
    codeHash: Field,
    nonce: Field,
}

#[oracle(get_account)]
unconstrained fn get_account_oracle(block_no: Field, address: str<42>) -> Account {}

unconstrained fn get_account(block_no: Field, address: str<42>) -> Account {
    get_account_oracle(block_no, address)
}

#[test]
fn test_get_account() {
    // TODO: implement get_account using oracle mock
}

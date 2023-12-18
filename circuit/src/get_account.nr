struct Account {
    balance: Field,
    codeHash: Field,
}

#[oracle(get_account)]
unconstrained fn get_account_oracle(block_no: Field, address: str<42>) -> Account {}

unconstrained fn get_account(block_no: Field, address: str<42>) -> Account {
    get_account_oracle(block_no, account)
}

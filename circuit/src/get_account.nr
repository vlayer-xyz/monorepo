use dep::proof;

struct Account {
    balance: Field,
    codeHash: Field,
    nonce: Field,
    state_root: [u8; 32],
    key: [u8; 20],
    value: [u8; 134],
    proof: [u8; 4256],
    depth: Field,
}

#[oracle(get_account)]
unconstrained fn get_account_oracle(block_no: Field, address: str<42>) -> Account {}

unconstrained fn get_account(block_no: Field, address: str<42>) -> Account {
    let account = get_account_oracle(block_no, address);
    let trie_proof = proof::TrieProof { key: account.key, proof: account.proof, depth: account.depth, value: account.value };
    assert(trie_proof.verify_state_root(account.state_root));

    account
}

#[test]
fn test_get_account() {
    // TODO: need and empty test for CI to pass
}

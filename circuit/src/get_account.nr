use dep::proof;

global PROOF_LEN = 4256;

struct AccountWithProof {
    balance: Field,
    codeHash: Field,
    nonce: Field,
    state_root: [u8; proof::KEY_LENGTH],
    key: [u8; 20],
    value: [u8; proof::MAX_ACCOUNT_STATE_LENGTH],
    proof: [u8; PROOF_LEN],
    depth: Field,
}

#[oracle(get_account)]
unconstrained fn get_account_oracle(_block_no: Field, _address: [u8; 20]) -> AccountWithProof {}

unconstrained fn get_account(block_no: Field, address: [u8; 20]) -> AccountWithProof {
    let account = get_account_oracle(block_no, address);
    let trie_proof = proof::TrieProof { key: account.key, proof: account.proof, depth: account.depth, value: account.value };
    assert(trie_proof.verify_state_root(account.state_root));

    account
}

#[test]
fn test_get_account() {
    // TODO: need and empty test for CI to pass
}

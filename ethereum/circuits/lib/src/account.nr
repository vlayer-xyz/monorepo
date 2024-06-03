use crate::account_with_storage::Account;
use crate::header::get_header;
use crate::misc::types::{Address, Bytes32, BYTES32_LENGTH};
use crate::verifiers::account::verify_account;
use crate::serde::Serde;
use crate::merkle_patricia_proofs::proof::ProofInput;

global MAX_KEY_LEN = 32;
global MAX_PREFIXED_KEY_NIBBLE_LEN = 66; // (MAX_KEY_LEN + 1) * 2
global MAX_ACCOUNT_DEPTH_NO_LEAF_M = 10; // Emperically correct values to be determined after we scan ethereum state trie.

global MAX_ACCOUNT_STATE_LEN = 110; // Values taken from accountProofConfig in account.ts.
global MAX_ACCOUNT_LEAF_LEN = 148;

struct AccountWithinBlock {
    account: Account,
    block_hash: Bytes32,
}

impl Eq for AccountWithinBlock {
    fn eq(self, other: Self) -> bool {
        (self.account == other.account) & (self.block_hash == other.block_hash)
    }
}

type AccountWithStateProofM = (Account, ProofInput<MAX_PREFIXED_KEY_NIBBLE_LEN, MAX_ACCOUNT_STATE_LEN, MAX_ACCOUNT_DEPTH_NO_LEAF_M, MAX_ACCOUNT_LEAF_LEN>);

type ProofInputSerialized<LEN> = [Field; LEN];

pub fn get_account(chain_id: Field, block_no: u64, address: Address) -> AccountWithinBlock {
    let (account, state_proof) = get_account_unconstrained_M(chain_id, block_no, address);
    let header = get_header(chain_id, block_no);
    verify_account(address, account, state_proof, header.state_root);
    AccountWithinBlock { account, block_hash: header.hash }
}

#[oracle(get_account)]
unconstrained fn get_account_oracle<PROOF_INPUT_LEN>(
    _chain_id: Field,
    _block_no: u64,
    _address: [u8; 20]
) -> (Account, ProofInputSerialized<PROOF_INPUT_LEN>) {}

unconstrained fn get_account_unconstrained_M(chain_id: Field, block_no: u64, address: Address) -> AccountWithStateProofM {
    let (account, proof_input) = get_account_oracle(chain_id, block_no, address);
    let proof_input = Serde::deserialize(proof_input);

    (account, proof_input)
}

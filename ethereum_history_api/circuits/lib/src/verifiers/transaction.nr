use dep::proof::const::HASH_LENGTH;
use dep::proof::transaction_proof::TransactionProof;

global MAX_ENCODED_TX_LENGTH: u64 = 525;
global MAX_TX_RLP_LENGTH: u64 = MAX_ENCODED_TX_LENGTH - 1;

pub(crate) fn assert_tx_proof<MAX_PROOF_LEN, MAX_RLP_LEN>(
    proof: TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN>,
    root: [u8; HASH_LENGTH]
) {
    assert(proof.verify_transaction_root(root), "TrieProof: Invalid tx root");
}

use dep::proof::const::HASH_LENGTH;
use dep::proof::transaction_proof::TransactionProof;

pub(crate) fn assert_tx_proof<MAX_PROOF_LEN, MAX_RLP_LEN>(proof: TransactionProof<MAX_PROOF_LEN, MAX_RLP_LEN>, root: [u8; HASH_LENGTH]) {
    assert(proof.verify_transaction_root(root), "TrieProof: Invalid tx root");
}

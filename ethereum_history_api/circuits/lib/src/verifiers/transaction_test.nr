mod assert_tx_proof {
    use crate::verifiers::transaction::assert_tx_proof;
    use crate::fixtures::mainnet::{
        cancun::small_block::{header::transactions_root, transaction_proof::proof},
        homestead::fork::{header::transactions_root as legacy_transactions_root, transaction_proof::proof as legacy_proof}
    };
    use crate::misc::arrays::alter_array;
    use dep::proof::const::MAX_TRIE_NODE_LENGTH;

    #[test]
    fn success() {
        assert_tx_proof(proof, transactions_root);
    }

    #[test]
    fn legacy_tx() {
        assert_tx_proof(legacy_proof, legacy_transactions_root);
    }

    #[test(should_fail_with="Internal node hash does not match the hash extracted from the preceding node")]
    fn invalid_tx_root() {
        assert_tx_proof(proof, legacy_transactions_root);
    }

    #[test(should_fail_with="Arrays do not match at specified offset")]
    fn invalid_value() {
        let mut proof_invalid_value = proof;
        proof_invalid_value.value[proof_invalid_value.value.len() - 1] += 1;
        assert_tx_proof(proof_invalid_value, transactions_root);
    }

    #[test(should_fail_with="Internal node hash does not match the hash extracted from the preceding node")]
    fn invalid_proof_internal_node() {
        let mut proof_invalid_proof = proof;
        let internal_node_offset = MAX_TRIE_NODE_LENGTH * 0;
        proof_invalid_proof.proof[internal_node_offset] += 1;
        assert_tx_proof(proof_invalid_proof, transactions_root);
    }

    #[test(should_fail_with="Transaction root: leaf node hash does not match the hash extracted from the preceding node")]
    fn invalid_proof_leaf_node() {
        let mut proof_invalid_proof = proof;
        let leaf_node_offset = MAX_TRIE_NODE_LENGTH * (proof.depth - 1);
        proof_invalid_proof.proof[leaf_node_offset] += 1;
        assert_tx_proof(proof_invalid_proof, transactions_root);
    }

    #[test(should_fail_with="Transaction root: leaf node hash does not match the hash extracted from the preceding node")]
    fn invalid_key() {
        let mut proof_invalid_key = proof;
        proof_invalid_key.key[0] += 1;
        assert_tx_proof(proof_invalid_key, transactions_root);
    }

    // TODO: This test should fail with an error message
    #[test(should_fail)]
    fn invalid_depth() {
        let mut proof_invalid_depth = proof;
        proof_invalid_depth.depth += 1;
        assert_tx_proof(proof_invalid_depth, transactions_root);
    }
}

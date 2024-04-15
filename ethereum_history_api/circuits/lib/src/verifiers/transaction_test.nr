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

mod assert_tx_equals {
    use crate::verifiers::transaction::assert_tx_equals;
    use crate::fixtures::mainnet::{
        cancun::small_block::transaction::{transaction, encoded_tx, tx_type},
        homestead::fork::transaction::{transaction as legacy_transaction, encoded_tx as legacy_encoded_tx, tx_type as legacy_tx_type}
    };

    #[test]
    fn success() {
        assert_tx_equals(tx_type, encoded_tx, transaction);
    }

    #[test]
    fn legacy_tx() {
        assert_tx_equals(legacy_tx_type, legacy_encoded_tx, legacy_transaction);
    }

    #[test(should_fail_with="Invalid tx type")]
    fn wrong_tx_type() {
        let wrong_tx_type = tx_type + 1;
        assert_tx_equals(wrong_tx_type, encoded_tx, transaction);
    }
}

mod verify_tx {
    use crate::verifiers::transaction::verify_tx;
    use crate::misc::arrays::alter_array;
    use crate::fixtures::mainnet::{
        cancun::small_block::{
        transaction::{transaction, encoded_tx, tx_type, tx_idx}, transaction_proof::proof,
        header::transactions_root
    },
        homestead::fork::{
        transaction::{
        transaction as legacy_transaction, encoded_tx as legacy_encoded_tx, tx_type as legacy_tx_type,
        tx_idx as legacy_tx_idx
    },
        transaction_proof::proof as legacy_proof, header::transactions_root as legacy_transactions_root
    }
    };

    #[test]
    fn success() {
        verify_tx(tx_idx, tx_type, transaction, proof, transactions_root);
    }

    #[test]
    fn legacy_tx() {
        verify_tx(
            legacy_tx_idx,
            legacy_tx_type,
            legacy_transaction,
            legacy_proof,
            legacy_transactions_root
        );
    }

    #[test(should_fail_with="Invalid tx type")]
    fn wrong_tx_type() {
        let wrong_tx_type = 1;
        verify_tx(tx_idx, wrong_tx_type, transaction, proof, transactions_root);
    }

    #[test(should_fail_with="Key does not match rlp-encoded transaction index")]
    fn wrong_tx_idx() {
        let mut wrong_tx_idx = tx_idx + 1;
        verify_tx(wrong_tx_idx, tx_type, transaction, proof, transactions_root);
    }

    #[test(should_fail_with="Nonce: Invalid RLP value")]
    fn wrong_tx() {
        let mut wrong_tx = transaction;
        wrong_tx.nonce += 1;
        verify_tx(tx_idx, tx_type, wrong_tx, proof, transactions_root);
    }

    #[test(should_fail_with="Internal node hash does not match the hash extracted from the preceding node")]
    fn wrong_tx_root() {
        let mut wrong_tx_root = alter_array(transactions_root);
        verify_tx(tx_idx, tx_type, transaction, proof, wrong_tx_root);
    }
}

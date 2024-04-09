mod test_leaf_get_len {

    use crate::merkle_patricia_proofs::proof::leaf_get_len;

    #[test]
    fn success() {
        let leaf = [0xc2, 0x42, 0x05];
        assert(leaf_get_len(leaf) == 3);
    }

    #[test]
    fn padded() {
        let leaf = [0xc2, 0x42, 0x05, 0x00];
        assert(leaf_get_len(leaf) == 3);
    }

    #[test(should_fail_with="Leaf RLP length exceeds MAX_LEN")]
    fn rlp_len_too_long() {
        let leaf = [0xc2, 0x42];
        let _ = leaf_get_len(leaf);
    }
}

mod simple {

    use crate::merkle_patricia_proofs::proof::{assert_merkle_proof, Proof};

    global key = [0x42];
    global value = [0x5];
    global root = [111, 55, 68, 69, 100, 157, 126, 28, 110, 183, 211, 184, 181, 177, 76, 191, 91, 188, 118, 229, 187, 95, 101, 143, 43, 37, 54, 208, 1, 206, 100, 245];

    #[test]
    fn success() {
        let proof = Proof { nodes: [], leaf: [0xc2, 0x42, 0x05], depth: 0 };
        assert_merkle_proof(key, value, root, proof);
    }

    #[test]
    fn value_padded() {
        let proof = Proof { nodes: [], leaf: [0xc2, 0x42, 0x05, 0x00], depth: 0 };
        assert_merkle_proof(key, value, root, proof);
    }

    #[test(should_fail_with="Leaf expected to have 2 fields")]
    fn invalid_leaf() {
        let root = [
            7, 95, 101, 84, 34, 173, 199, 202, 255, 196, 61, 234, 106, 5, 168, 57, 67, 221, 206, 185, 138, 146, 151, 237, 233, 193, 118, 117, 84, 218, 39, 239
        ];
        let proof = Proof { nodes: [], leaf: [0xc1, 0x42, 0x00], depth: 0 };
        assert_merkle_proof(key, value, root, proof);
    }

    #[test(should_fail_with="Invalid root")]
    fn invalid_root() {
        let root = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        let proof = Proof { nodes: [], leaf: [0xc2, 0x42, 0x05], depth: 0 };
        assert_merkle_proof(key, value, root, proof);
    }

    #[test(should_fail_with="Value mismatch")]
    fn value_mismatch() {
        let wrong_value = [0x06];
        let proof = Proof { nodes: [], leaf: [0xc2, 0x42, 0x05], depth: 0 };
        assert_merkle_proof(key, wrong_value, root, proof);
    }

    #[test(should_fail_with="Key mismatch")]
    fn key_mismatch() {
        let root = [
            0x11, 0x73, 0x86, 0x5a, 0xe7, 0x36, 0xbc, 0xb6, 0x19, 0xe3, 0x38, 0xa5, 0x6d, 0xb5, 0x2d, 0x78, 0x3f, 0x36, 0x6d, 0x99, 0x5a, 0x91, 0x27, 0x44, 0x37, 0xe6, 0x1b, 0x56, 0xa1, 0x1e, 0x60, 0xb0
        ];
        let wrong_key = [0x20, 0x81];
        let value = [0x0a];
        let proof = Proof { nodes: [], leaf: [0xc4, 0x82, 0x20, 0x80, 0x0a], depth: 0 };
        assert_merkle_proof(wrong_key, value, root, proof);
    }
}

mod from_fixtures {

    use crate::merkle_patricia_proofs::proof::{assert_merkle_proof, Proof};
    use crate::fixtures::merkle_proofs::leaf::{
        key as fixture_key, value as fixture_value, nodes as fixture_nodes, leaf as fixture_leaf,
        root as fixture_root
    };

    #[test]
    fn success() {
        assert_merkle_proof(
            fixture_key,
            fixture_value,
            fixture_root,
            Proof { nodes: fixture_nodes, leaf: fixture_leaf, depth: 0 }
        )
    }
}

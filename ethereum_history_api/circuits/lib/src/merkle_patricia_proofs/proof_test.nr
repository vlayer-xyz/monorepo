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

mod test_assert_merkle_proof {

    use crate::merkle_patricia_proofs::proof::{assert_merkle_proof, leaf_get_len, Proof};
    global key = [0x42];
    global value = [0x5];
    global root = [111, 55, 68, 69, 100, 157, 126, 28, 110, 183, 211, 184, 181, 177, 76, 191, 91, 188, 118, 229, 187, 95, 101, 143, 43, 37, 54, 208, 1, 206, 100, 245];

    #[test]
    fn simple_success() {
        let proof = Proof { nodes: [], leaf: [0xc2, 0x42, 0x05], depth: 0 };
        assert_merkle_proof(value, root, proof);
    }

    #[test]
    fn value_padded() {
        let proof = Proof { nodes: [], leaf: [0xc2, 0x42, 0x05, 0x00], depth: 0 };
        assert_merkle_proof(value, root, proof);
    }

    #[test(should_fail_with="Leaf expected to have 2 fields")]
    fn invalid_leaf() {
        let root = [
            7, 95, 101, 84, 34, 173, 199, 202, 255, 196, 61, 234, 106, 5, 168, 57, 67, 221, 206, 185, 138, 146, 151, 237, 233, 193, 118, 117, 84, 218, 39, 239
        ];
        let proof = Proof { nodes: [], leaf: [0xc1, 0x42, 0x00], depth: 0 };
        assert_merkle_proof(value, root, proof);
    }

    #[test(should_fail_with="Invalid root")]
    fn invalid_root() {
        let root = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        let proof = Proof { nodes: [], leaf: [0xc2, 0x42, 0x05], depth: 0 };
        assert_merkle_proof(value, root, proof);
    }

    #[test(should_fail_with="Value mismatch")]
    fn value_mismatch() {
        let wrong_value = [0x06];
        let proof = Proof { nodes: [], leaf: [0xc2, 0x42, 0x05], depth: 0 };
        assert_merkle_proof(wrong_value, root, proof);
    }
}

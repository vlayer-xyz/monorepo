mod parity {
    use crate::merkle_patricia_proofs::proof::{EVEN, ODD, parity};

    #[test]
    fn all_parities() {
        assert(parity(0) == EVEN);
        assert(parity(1) == ODD);
        assert(parity(2) == EVEN);
        assert(parity(3) == ODD);
    }

    #[test(should_fail_with="Prefix must be 0, 1, 2 or 3")]
    fn invalid_parity() {
        let _ = parity(4);
    }
}

mod strip_prefix {

    use crate::misc::fragment::Fragment;
    use crate::merkle_patricia_proofs::proof::strip_prefix;

    #[test]
        fn success_even() {
        let prefixed_key_bytes = Fragment::new_with_length(3, [0x20, 0xab, 0xcd, 0x00, 0x00, 0x00]);
        let stripped_nibbles = strip_prefix(prefixed_key_bytes);
        assert(
            stripped_nibbles == Fragment::new_with_length(4, [0xa, 0xb, 0xc, 0xd, 0x0, 0x0]), "Incorrect stripping of even prefix"
        );
    }

    #[test]
        fn success_odd() {
        let prefixed_key_bytes = Fragment::new_with_length(3, [0x3a, 0xbc, 0xde, 0x00, 0x00, 0x00]);
        let stripped_nibbles = strip_prefix(prefixed_key_bytes);
        assert(
            stripped_nibbles == Fragment::new_with_length(5, [0xa, 0xb, 0xc, 0xd, 0xe, 0x0]), "Incorrect stripping of odd prefix"
        );
    }

    #[test(should_fail_with="Expected a zero after a prefix of even parity")]
    fn non_zero_after_even_prefix() {
        let wrong_prefix = 0x21;
        let prefixed_key_bytes = Fragment::new_with_length(3, [wrong_prefix, 0xab, 0xcd, 0x00, 0x00, 0x00]);
        let _ = strip_prefix(prefixed_key_bytes);
    }

    #[test(should_fail_with="Prefix must be 0, 1, 2 or 3")]
        fn invalid_prefix() {
        let prefixed_key_bytes = Fragment::new_with_length(2, [0x4a, 0xbc, 0x00, 0x00]);
        let _ = strip_prefix(prefixed_key_bytes);
    }
}

mod extract_hash {

    use crate::merkle_patricia_proofs::proof::extract_hash;
    use crate::misc::fragment::Fragment;
    use crate::fixtures::merkle_proofs::branch_then_leaf::nodes as fixture_nodes;

    global hash = [0x4d, 0xf3, 0xf1, 0x5d, 0xfc, 0x22, 0x96, 0x36, 0xc2, 0x7f, 0x5f, 0xfb, 0x66, 0x73, 0x0d, 0x90, 0x41, 0x23, 0xd3, 0xd8, 0xd6, 0xe3, 0xbc, 0xf0, 0x32, 0x5d, 0xf7, 0x1e, 0x13, 0xfb, 0xec, 0xbb];
    
    #[test]
    fn branch_node() {
        let node = fixture_nodes[0];
        let key_nibble = 0x0;
        assert(extract_hash(node, Fragment::new_focused([key_nibble]), &mut 0) == hash);
    }

    #[test(should_fail_with="Expected a hash at position given by the key nibble")]
    fn fail_branch_node() {
        let node = fixture_nodes[0];
        let key_nibble = 0x2;
        assert(extract_hash(node, Fragment::new_focused([key_nibble]), &mut 0) == hash);
    }
}

mod leaf_get_len {

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

    #[test(should_fail_with="Decoded length of short list exceeds input length")]
    fn rlp_len_too_long() {
        let leaf = [0xc2, 0x42];
        let _ = leaf_get_len(leaf);
    }
}

mod assert_merkle_proof {

    use crate::merkle_patricia_proofs::proof::{assert_merkle_proof, Proof};
    use crate::misc::arrays::alter_array;

    global key = [0x00, 0x00, 0x00, 0x42];
    global value = [0x5];
    global root = [163, 57, 232, 136, 93, 33, 132, 208, 116, 119, 95, 134, 32, 201, 51, 214, 218, 75, 93, 113, 140, 143, 254, 21, 52, 83, 99, 97, 54, 246, 121, 173];
    global leaf = [0xc4, 0x82, 0x20, 0x42, 0x05];

    #[test]
    fn success() {
        let proof = Proof { nodes: [], leaf, depth: 1 };
        assert_merkle_proof(key, value, root, proof);
    }

    #[test]
    fn value_padded() {
        let proof = Proof { nodes: [], leaf: [0xc4, 0x82, 0x20, 0x42, 0x05, 0x0, 0x0, 0x0], depth: 1 };
        assert_merkle_proof(key, value, root, proof);
    }

    #[test(should_fail_with="Leaf expected to have 2 fields")]
    fn invalid_leaf() {
        let proof = Proof { nodes: [], leaf: [0xc1, 0x42, 0x00], depth: 1 };
        assert_merkle_proof(key, value, root, proof);
    }

    #[test(should_fail_with="Invalid root")]
    fn invalid_root() {
        let wrong_root = alter_array(root);
        let proof = Proof { nodes: [], leaf, depth: 1 };
        assert_merkle_proof(key, value, wrong_root, proof);
    }

    #[test(should_fail_with="Value mismatch")]
    fn value_mismatch() {
        let wrong_value = alter_array(value);
        let proof = Proof { nodes: [], leaf, depth: 1 };
        assert_merkle_proof(key, wrong_value, root, proof);
    }

    #[test(should_fail_with="Key mismatch")]
    fn key_mismatch() {
        let wrong_key = [0x00, 0x00, 0x00, 0x43];
        let proof = Proof { nodes: [], leaf, depth: 1 };
        assert_merkle_proof(wrong_key, value, root, proof);
    }
}

mod assert_merkle_proof_from_fixtures {

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
            Proof { nodes: fixture_nodes, leaf: fixture_leaf, depth: 1 }
        )
    }
}

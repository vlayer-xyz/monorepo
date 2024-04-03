use crate::merkle_patricia_proofs::proof::{assert_merkle_proof, Proof};

global key = [0x42];
global value = [0x5];
global root = [111, 55, 68, 69, 100, 157, 126, 28, 110, 183, 211, 184, 181, 177, 76, 191, 91, 188, 118, 229, 187, 95, 101, 143, 43, 37, 54, 208, 1, 206, 100, 245];

#[test]
fn test_example() {
    let proof = Proof { nodes: [], leaf: [0xc2, 0x42, 0x05], depth: 0 };
    assert_merkle_proof(key, value, root, proof);
}

#[test(should_fail_with="Leaf expected to have 2 fields")]
fn test_simple_invalid_leaf() {
    let proof = Proof { nodes: [], leaf: [0xc1, 0x42, 0x00], depth: 0 };
    assert_merkle_proof(key, value, root, proof);
}

#[test(should_fail_with="Invalid root")]
fn test_example_fail_invaid_root() {
    let root = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let proof = Proof { nodes: [], leaf: [0xc2, 0x42, 0x05], depth: 0 };
    assert_merkle_proof(key, value, root, proof);
}

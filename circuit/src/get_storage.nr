use dep::proof;
use dep::std::test::OracleMock;

struct Storage {
    proof: [u8; 2660], // Trie proof (5 levels * rlp encoded branch node size (532 bytes))
    key: [u8; 32], // The storage slot we would like to prove
    storageRoot: [u8; 32], // The storage root we would like to prove against
    value: [u8; 32], // The value in the storage slot,
    depth: Field, // The depth of the trie
}

#[oracle(get_storage)]
unconstrained fn get_storage_oracle(block_no: Field, address: str<42>, storage_key: [u8; 32]) -> Storage {}

unconstrained fn get_storage(block_no: Field, address: str<42>, storage_key: [u8; 32]) -> Storage {
    let storage = get_storage_oracle(block_no, address, storage_key);

    let trie_proof = proof::TrieProof { key: storage.key, proof: storage.proof, depth: storage.depth, value: storage.value };

    // Constrain the proof to be valid
    assert(trie_proof.verify_storage_root(storage.storageRoot));

    storage
}

#[test]
fn test_get_storage() {
    OracleMock::mock("get_storage").returns(Storage { proof: [0; 2660], key: [0; 32], storageRoot: [0; 32], value: [0; 32], depth: 0 });

    let storage = get_storage(0, "0x0000000000000000000000000000000000000000", [0; 32]);
}

use crate::storage::{verify_storage_value};
use crate::fixtures::paris::usdc::storage_proof::storage_proofs_with_storage_root;

#[test]
fn test_verify_storage_proof() {
    let _ = verify_storage_value(
        storage_proofs_with_storage_root.storage_root,
        storage_proofs_with_storage_root.proofs[0]
    );
}

#[test(should_fail)]
fn test_verify_storage_proof_invalid_storage_root() {
    let mut storage_root = storage_proofs_with_storage_root.storage_root;
    storage_root[0] += 1;

    let _ = verify_storage_value(storage_root, storage_proofs_with_storage_root.proofs[0]);
}

#[test(should_fail)]
fn test_verify_storage_proof_invalid_proof() {
    let mut storage_proof = storage_proofs_with_storage_root.proofs[0];
    storage_proof.proof[0] += 1;

    let _ = verify_storage_value(storage_proofs_with_storage_root.storage_root, storage_proof);
}

#[test(should_fail)]
fn test_verify_storage_proof_invalid_depth() {
    let mut storage_proof = storage_proofs_with_storage_root.proofs[0];
    storage_proof.depth += 1;

    let _ = verify_storage_value(storage_proofs_with_storage_root.storage_root, storage_proof);
}

#[test(should_fail)]
fn test_verify_storage_proof_invalid_key() {
    let mut storage_proof = storage_proofs_with_storage_root.proofs[0];
    storage_proof.key[0] += 1;

    let _ = verify_storage_value(storage_proofs_with_storage_root.storage_root, storage_proof);
}

#[test(should_fail)]
fn test_verify_storage_proof_invalid_value() {
    let mut storage_proof = storage_proofs_with_storage_root.proofs[0];
    storage_proof.value[0] += 1;

    let _ = verify_storage_value(storage_proofs_with_storage_root.storage_root, storage_proof);
}

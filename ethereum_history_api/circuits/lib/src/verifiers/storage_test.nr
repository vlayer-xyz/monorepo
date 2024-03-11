use crate::fixtures::mainnet::paris::usdc::{storage_proof::proofs, account::storage_root};
use crate::verifiers::storage::{verify_storage_value, verify_storage_values};

#[test]
fn test_verify_storage_values() {
    let _ = verify_storage_values(storage_root, proofs);
}

#[test(should_fail)]
fn test_verify_storage_values_invalid_storage_root() {
    let mut root = storage_root;
    root[0] += 1;

    let _ = verify_storage_values(root, proofs);
}

#[test]
fn test_verify_storage_value() {
    let _ = verify_storage_value(storage_root, proofs[0]);
}

#[test(should_fail)]
fn test_verify_storage_value_invalid_storage_root() {
    let mut root = storage_root;
    root[0] += 1;

    let _ = verify_storage_value(root, proofs[0]);
}

#[test(should_fail)]
fn test_verify_storage_value_invalid_proof() {
    let mut proof = proofs[0];
    proof.proof[0] += 1;

    let _ = verify_storage_value(storage_root, proof);
}

#[test(should_fail)]
fn test_verify_storage_value_invalid_depth() {
    let mut proof = proofs[0];
    proof.depth += 1;

    let _ = verify_storage_value(storage_root, proof);
}

#[test(should_fail)]
fn test_verify_storage_value_invalid_key() {
    let mut proof = proofs[0];
    proof.key[0] += 1;

    let _ = verify_storage_value(storage_root, proof);
}

#[test(should_fail)]
fn test_verify_storage_value_invalid_value() {
    let mut proof = proofs[0];
    proof.value[0] += 1;

    let _ = verify_storage_value(storage_root, proof);
}

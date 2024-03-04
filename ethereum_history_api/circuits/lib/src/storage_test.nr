use crate::storage::{verify_storage_value};
use crate::fixtures::paris::usdc::storage_proof::storage_proofs_with_storage_root;

#[test]
fn test_asseert_storage_proof() {
    let _ = verify_storage_value(
        storage_proofs_with_storage_root.storage_root,
        storage_proofs_with_storage_root.proofs[0]
    );
}

use crate::account_with_storage_recursive::{get_account_with_storage_recursive, RecursiveProof};
use crate::account_with_storage::StorageWithinBlock;
use crate::fixtures::mainnet::paris::usdc_circle::{header::{number, hash}, account::{address, account} storage::{keys, values}};
use crate::chain::ETHEREUM_MAINNET_ID;
use crate::misc::types::{Bytes32, Address};
use dep::std::test::OracleMock;

#[test]
fn success() {
    let result = StorageWithinBlock { block_hash: hash, account, values };
    let recursive_proof = RecursiveProof { key_hash: 1, verification_key: [0; 114], proof: [0; 93] };

    let _ = OracleMock::mock("get_account_with_storage_recursive").returns((result.serialize(), recursive_proof));

    get_account_with_storage_recursive(ETHEREUM_MAINNET_ID, number, address, keys[0]);
}

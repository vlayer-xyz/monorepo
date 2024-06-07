mod is_dao_worthy_main {
    use dep::std::test::OracleMock;
    use dep::ethereum::fixtures::mainnet::{
        paris::usdc_circle::header::{hash, block_header_partial as paris_block_header_partial, block_header_rlp as paris_block_header_rlp},
        paris::usdc_circle::account::account, paris::usdc_circle::storage::values,
        paris::usdc_circle::state_proof::proof_input_serialized as state_proof_input_serialized,
        paris::usdc_circle::storage_proof::proofs_serialized
    };
    use dep::ethereum::{account_with_storage_recursive::RecursiveProof, account_with_storage::StorageWithinBlock};
    use crate::main;

    #[test]
    fn success_greater_then() {
        let result = StorageWithinBlock { block_hash: hash, account, values };
        let recursive_proof = RecursiveProof { key_hash: 1, verification_key: [0; 114], proof: [0; 93] };

        let _ = OracleMock::mock("get_storage_recursive").returns((result.serialize(), recursive_proof));
        let _ = OracleMock::mock("get_header").returns((paris_block_header_partial, paris_block_header_rlp));
        let _ = OracleMock::mock("get_proof").returns((account, state_proof_input_serialized, proofs_serialized[0]));

        let block_number = 19_000_000;
        let circle_address = [
            0x55, 0xfe, 0x00, 0x2a, 0xef, 0xf0, 0x2f, 0x77, 0x36, 0x4d, 0xe3, 0x39, 0xa1, 0x29, 0x29, 0x23, 0xa1, 0x58, 0x44, 0xb8
        ];
        main(circle_address, block_number);
    }
}

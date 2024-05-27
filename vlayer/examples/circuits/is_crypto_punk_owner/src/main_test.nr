mod is_crypto_punk_owner_main {
    use dep::std::test::OracleMock;
    use dep::ethereum::{
        fixtures::mainnet::london::crypto_punks::{
        header::{block_header_partial as london_block_header_partial, block_header_rlp as london_block_header_rlp},
        account::account, state_proof_new::proof_input_serialized as state_proof_input_serialized, storage_proof_new::proofs_serialized
    },
        misc::arrays::alter_array
    };
    use crate::main;

    global CRYPTO_PUNK_OWNER_WALLER_ADDRESS = [
        0xc3, 0x52, 0xb5, 0x34, 0xe8, 0xb9, 0x87, 0xe0, 0x36, 0xa9, 0x35, 0x39, 0xfd, 0x68, 0x97, 0xf5, 0x34, 0x88, 0xe5, 0x6a
    ];
    global BLOCK_NUMBER = 14_194_126;

    #[test]
    fn success() {
        let _ = OracleMock::mock("get_header").returns((london_block_header_partial, london_block_header_rlp));
        let _ = OracleMock::mock("get_proof").returns((account, state_proof_input_serialized, proofs_serialized[0]));
        let token_id = 9;
        main(CRYPTO_PUNK_OWNER_WALLER_ADDRESS, token_id, BLOCK_NUMBER);
    }

    #[test(should_fail_with = "Owner is not the same as the wallet address")]
    fn invalid_wallet() {
        let _ = OracleMock::mock("get_header").returns((london_block_header_partial, london_block_header_rlp));
        let _ = OracleMock::mock("get_proof").returns((account, state_proof_input_serialized, proofs_serialized[0]));

        let token_id = 9;
        main(
            alter_array(CRYPTO_PUNK_OWNER_WALLER_ADDRESS),
            token_id,
            BLOCK_NUMBER
        );
    }

    #[test(should_fail_with = "Token ID is too high")]
    fn to_big_token_id() {
        let token_id = 10001;
        main(CRYPTO_PUNK_OWNER_WALLER_ADDRESS, token_id, BLOCK_NUMBER);
    }
}

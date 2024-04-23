mod is_ape_owner_main {
    use dep::std::test::OracleMock;
    use dep::ethereum_history_api::{
        fixtures::mainnet::paris::bored_ape_yacht_club::{
        header::{block_header_partial as paris_block_header_partial, block_header_rlp as paris_block_header_rlp},
        account::account, state_proof::state_proof, storage_proof::proofs
    },
        misc::arrays::alter_array
    };
    use crate::main;

    global BORED_APE_OWNER_WALLER_ADDRESS = [
        0x13, 0x70, 0x24, 0xfc, 0xa6, 0xcd, 0x54, 0x2e, 0x95, 0x97, 0xd5, 0xa5, 0x51, 0xeb, 0xb1, 0xbd, 0x12, 0xdc, 0xc7, 0x03
    ];
    global BLOCK_NUMBER = 19_000_000;

    #[test]
    fn success() {
        let _ = OracleMock::mock("get_header").returns((paris_block_header_partial, paris_block_header_rlp));
        let _ = OracleMock::mock("get_proof").returns((account, state_proof, proofs[0]));

        let token_id = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7
        ];
        main(BORED_APE_OWNER_WALLER_ADDRESS, token_id, BLOCK_NUMBER);
    }

    #[test(should_fail_with = "Owner is not the same as the wallet address")]
    fn invalid_wallet() {
        let _ = OracleMock::mock("get_header").returns((paris_block_header_partial, paris_block_header_rlp));
        let _ = OracleMock::mock("get_proof").returns((account, state_proof, proofs[0]));

        let token_id = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7
        ];
        main(
            alter_array(BORED_APE_OWNER_WALLER_ADDRESS),
            token_id,
            BLOCK_NUMBER
        );
    }

    #[test(should_fail_with = "Token ID is too high")]
    fn to_big_token_id() {
        let token_id = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x27, 0x10
        ];
        main(BORED_APE_OWNER_WALLER_ADDRESS, token_id, BLOCK_NUMBER);
    }
}

mod test_ERC20Token {
    use dep::std::test::OracleMock;
    use crate::token::ERC20Token;
    use dep::ethereum_history_api::fixtures::mainnet::{
        paris::usdc_circle::header::{block_header_partial as paris_block_header_partial, block_header_rlp as paris_block_header_rlp},
        paris::usdc_circle::header::{hash, number, state_root, transactions_root, receipts_root},
        paris::usdc_circle::account::account, paris::usdc_circle::state_proof::state_proof,
        paris::usdc_circle::storage_proof::proofs
    };

    #[test]
    fn success() {
        let _ = OracleMock::mock("get_header").returns((paris_block_header_partial, paris_block_header_rlp));
        let _ = OracleMock::mock("get_proof").returns((account, state_proof, proofs[0]));

        let usdc_token = ERC20Token {
            address: [
                0xa0, 0xb8, 0x69, 0x91, 0xc6, 0x21, 0x8b, 0x36, 0xc1, 0xd1, 0x9d, 0x4a, 0x2e, 0x9e, 0xb0, 0xce, 0x36, 0x06, 0xeb, 0x48
            ],
            balances_slot: 9,
            chain_id: 0
        };

        let circle_address = [
            0x55, 0xFE, 0x00, 0x2a, 0xef, 0xF0, 0x2F, 0x77, 0x36, 0x4d, 0xe3, 0x39, 0xa1, 0x29, 0x29, 0x23, 0xA1, 0x58, 0x44, 0xB8
        ];
        let block_number = 19000000;
        let balance = usdc_token.get_balance(circle_address, block_number);
        let expected_usdc_balnce_of_circle = 125761774888720;
        assert_eq(expected_usdc_balnce_of_circle, balance);
    }
}

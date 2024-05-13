mod mainnet {
    use crate::nft::ERC721Token;
    use crate::chain_id;
    use crate::slot::{struct_slot, dynamic_array_with_precalculated_slot};
    use dep::std::field::bytes32_to_field;
    use dep::ethereum_history_api::misc::{types::Bytes32, field::field_to_bytes32};

    global BORED_APE_YACHT_CLUB = ERC721Token {
        address: [0xbc, 0x4c, 0xa0, 0xed, 0xa7, 0x64, 0x7a, 0x8a, 0xb7, 0xc2, 0x06, 0x1c, 0x2e, 0x11, 0x8a, 0x18, 0xa9, 0x36, 0xf1, 0x3d],
        token_id_to_slot: |token_id| {
            let BORED_APE_YACHT_CLUB_MAX_TOKEN_ID: u64 = 9999;
            let BORED_APE_YACHT_CLUB_TOKEN_OWNERS_INNER_ENTRIES_SLOT = [
                0x40, 0x57, 0x87, 0xfa, 0x12, 0xa8, 0x23, 0xe0, 0xf2, 0xb7, 0x63, 0x1c, 0xc4, 0x1b, 0x3b, 0xa8, 0x82, 0x8b, 0x33, 0x21, 0xca, 0x81, 0x11, 0x11, 0xfa, 0x75, 0xcd, 0x3a, 0xa3, 0xbb, 0x5a, 0xce
            ];
            let VALUE_INDEX = 1;

            assert(bytes32_to_field(token_id) as u64 <= BORED_APE_YACHT_CLUB_MAX_TOKEN_ID, "Token ID is too high");
            let owner_slot = dynamic_array_with_precalculated_slot(BORED_APE_YACHT_CLUB_TOKEN_OWNERS_INNER_ENTRIES_SLOT, 2, bytes32_to_field(token_id));
            struct_slot(owner_slot, VALUE_INDEX)
        },
        chain_id: chain_id::MAINNET
    };

    global CRYPTOPUNKS = ERC721Token {
        address: [0xb4, 0x7e, 0x3c, 0xd8, 0x37, 0xdd, 0xf8, 0xe4, 0xc5, 0x7f, 0x05, 0xd7, 0x0a, 0xb8, 0x65, 0xde, 0x6e, 0x19, 0x3b, 0xbb],
        token_id_to_slot: |token_id| {
            let CRYPTOPUNK_MAX_TOKEN_ID: u64 = 9999;
            let CRYPTOPUNK_TOKEN_OWNERS_INNER_ENTRIES_SLOT = [
                0x13, 0xda, 0x86, 0x00, 0x8b, 0xa1, 0xc6, 0x92, 0x2d, 0xae, 0xe3, 0xe0, 0x7d, 0xb9, 0x53, 0x05, 0xef, 0x49, 0xeb, 0xce, 0xd9, 0xf5, 0x46, 0x7a, 0x0b, 0x86, 0x13, 0xfc, 0xc6, 0xb3, 0x43, 0xe3
            ];
            let VALUE_INDEX = 1;

            assert(bytes32_to_field(token_id) as u64 <= CRYPTOPUNK_MAX_TOKEN_ID, "Token ID is too high");
            let owner_slot = dynamic_array_with_precalculated_slot(CRYPTOPUNK_TOKEN_OWNERS_INNER_ENTRIES_SLOT, 2, bytes32_to_field(token_id));
            struct_slot(owner_slot, VALUE_INDEX)
        },
        chain_id: chain_id::MAINNET        
    };

    global NOUNS = ERC721Token {
        address: [0x9c, 0x8f, 0xf3, 0x14, 0xc9, 0xbc, 0x7f, 0x6e, 0x59, 0xa9, 0xd9, 0x22, 0x5f, 0xb2, 0x29, 0x46, 0x42, 0x7e, 0xdc, 0x03],
        token_id_to_slot: |token_id| {
            let NOUNS_MAX_TOKEN_ID: u64 = 9999;
            let NOUNS_TOKEN_OWNERS_INNER_ENTRIES_SLOT = [
                0x36, 0x17, 0x31, 0x9a, 0x05, 0x4d, 0x77, 0x2f, 0x90, 0x9f, 0x7c, 0x47, 0x9a, 0x2c, 0xeb, 0xe5, 0x06, 0x6e, 0x83, 0x6a, 0x93, 0x94, 0x12, 0xe3, 0x24, 0x03, 0xc9, 0x90, 0x29, 0xb9, 0x2e, 0xff
            ];
            let VALUE_INDEX = 1;

            assert(bytes32_to_field(token_id) as u64 <= NOUNS_MAX_TOKEN_ID, "Token ID is too high");
            let owner_slot = dynamic_array_with_precalculated_slot(NOUNS_TOKEN_OWNERS_INNER_ENTRIES_SLOT, 2, bytes32_to_field(token_id));
            struct_slot(owner_slot, VALUE_INDEX)
        },
        chain_id: chain_id::MAINNET        
    };    
}

mod sepolia {
    use crate::nft::ERC721Token;
    use crate::chain_id;
    use crate::slot::{struct_slot, dynamic_array_with_precalculated_slot};
    use dep::std::field::bytes32_to_field;
    use dep::ethereum_history_api::misc::{types::Bytes32, field::field_to_bytes32};

    // free mint: https://sepolia.etherscan.io/address/0x80d97726548fedae6ad7cf8df4f2b514fd24afba#readContract
    global FAKE_BORED_APE_YACHT_CLUB = ERC721Token {
        address: [0x80, 0xd9, 0x77, 0x26, 0x54, 0x8f, 0xed, 0xae, 0x6a, 0xd7, 0xcf, 0x8d, 0xf4, 0xf2, 0xb5, 0x14, 0xfd, 0x24, 0xaf, 0xba],
        token_id_to_slot: |token_id| {
            let BORED_APE_YACHT_CLUB_MAX_TOKEN_ID: u64 = 9999;
            let BORED_APE_YACHT_CLUB_TOKEN_OWNERS_INNER_ENTRIES_SLOT = [
                0x40, 0x57, 0x87, 0xfa, 0x12, 0xa8, 0x23, 0xe0, 0xf2, 0xb7, 0x63, 0x1c, 0xc4, 0x1b, 0x3b, 0xa8, 0x82, 0x8b, 0x33, 0x21, 0xca, 0x81, 0x11, 0x11, 0xfa, 0x75, 0xcd, 0x3a, 0xa3, 0xbb, 0x5a, 0xce
            ];
            let VALUE_INDEX = 1;

            assert(bytes32_to_field(token_id) as u64 <= BORED_APE_YACHT_CLUB_MAX_TOKEN_ID, "Token ID is too high");
            let owner_slot = dynamic_array_with_precalculated_slot(BORED_APE_YACHT_CLUB_TOKEN_OWNERS_INNER_ENTRIES_SLOT, 2, bytes32_to_field(token_id));
            struct_slot(owner_slot, VALUE_INDEX)
        },
        chain_id: chain_id::SEPOLIA
    };
}

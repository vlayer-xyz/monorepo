mod mainnet {
    use crate::nft::ERC721Token;
    use crate::chain_id;
    use crate::slot::{struct_slot, dynamic_array_with_precalculated_slot};
    use dep::ethereum_history_api::misc::bytes::add_bytes;
    use dep::std::field::bytes32_to_field;
    use dep::ethereum_history_api::misc::{types::Bytes32, field::field_to_bytes32};

    global BORED_APE_YACHT_CLUB = ERC721Token {
        address: [0xbc, 0x4c, 0xa0, 0xed, 0xa7, 0x64, 0x7a, 0x8a, 0xb7, 0xc2, 0x06, 0x1c, 0x2e, 0x11, 0x8a, 0x18, 0xa9, 0x36, 0xf1, 0x3d],
        token_id_to_slot: |token_id| {
            let BORED_APE_YACHT_CLUB_TOKEN_OWNERS_INNER_ENTRIES_SLOT = [
                0x40, 0x57, 0x87, 0xfa, 0x12, 0xa8, 0x23, 0xe0, 0xf2, 0xb7, 0x63, 0x1c, 0xc4, 0x1b, 0x3b, 0xa8, 0x82, 0x8b, 0x33, 0x21, 0xca, 0x81, 0x11, 0x11, 0xfa, 0x75, 0xcd, 0x3a, 0xa3, 0xbb, 0x5a, 0xce
            ];
            let VALUE_INDEX = 1;

            let owner_slot = dynamic_array_with_precalculated_slot(BORED_APE_YACHT_CLUB_TOKEN_OWNERS_INNER_ENTRIES_SLOT, 2, bytes32_to_field(token_id));
            struct_slot(owner_slot, VALUE_INDEX)
        },
        chain_id: chain_id::MAINNET
    };
}

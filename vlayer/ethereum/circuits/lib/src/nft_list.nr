mod mainnet {
    use crate::nft::ERC721Token;
    use crate::chain_id;
    use dep::ethereum_history_api::misc::field::field_to_bytes32;
    use dep::std::field::bytes32_to_field;

    global BORED_APE_YACHT_CLUB_TOKEN_OWNERS_INNER_SLOT = 0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace;

    global BORED_APE_YACHT_CLUB = ERC721Token {
        address: [0xbc, 0x4c, 0xa0, 0xed, 0xa7, 0x64, 0x7a, 0x8a, 0xb7, 0xc2, 0x06, 0x1c, 0x2e, 0x11, 0x8a, 0x18, 0xa9, 0x36, 0xf1, 0x3d],
        token_id_to_slot: |token_id| field_to_bytes32(BORED_APE_YACHT_CLUB_TOKEN_OWNERS_INNER_SLOT + 2 * bytes32_to_field(token_id) + 1),
        chain_id: chain_id::MAINNET
    };
}

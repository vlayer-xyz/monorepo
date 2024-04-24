mod mainnet {
    use crate::nft::ERC721Token;
    use crate::chain_id;
    use crate::slot::{struct_slot, dynamic_array};
    use dep::ethereum_history_api::misc::bytes::add_bytes;
    use dep::std::field::bytes32_to_field;
    use dep::ethereum_history_api::misc::{types::Bytes32, field::field_to_bytes32};

    global BORED_APE_YACHT_CLUB = ERC721Token {
        address: [0xbc, 0x4c, 0xa0, 0xed, 0xa7, 0x64, 0x7a, 0x8a, 0xb7, 0xc2, 0x06, 0x1c, 0x2e, 0x11, 0x8a, 0x18, 0xa9, 0x36, 0xf1, 0x3d],
        token_id_to_slot: |token_id| {
            let TOKEN_OWNERS_SLOT = 2;
            let INNER_INDEX = 0;
            let ENTRIES_INDEX = 0;
            let VALUE_INDEX = 1;

            let inner_slot = struct_slot(field_to_bytes32(TOKEN_OWNERS_SLOT), INNER_INDEX);
            let entries_slot = struct_slot(inner_slot, ENTRIES_INDEX);
            let owner_slot = dynamic_array(entries_slot, 2, bytes32_to_field(token_id));
            let owner_values_slot = struct_slot(owner_slot, VALUE_INDEX);

            owner_values_slot
        },
        chain_id: chain_id::MAINNET
    };
}

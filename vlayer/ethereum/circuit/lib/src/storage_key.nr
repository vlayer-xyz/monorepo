use dep::ethereum_history_api::misc::{types::{Address, Bytes32, ADDRESS_LENGTH, BYTES32_LENGTH}, field::field_to_bytes32};
use dep::std::hash::keccak256;

global STORAGE_KEY_HASH_INPUT_LENGTH = 64;

pub(crate) fn calculate_mapping_address_storage_key(slot: Field, address: Address) -> Bytes32 {
    let mut vector: BoundedVec<u8, STORAGE_KEY_HASH_INPUT_LENGTH> = BoundedVec::new();

    vector.extend_from_array([0; BYTES32_LENGTH - ADDRESS_LENGTH]);
    vector.extend_from_array(address);
    vector.extend_from_array(field_to_bytes32(slot));

    keccak256(vector.storage(), STORAGE_KEY_HASH_INPUT_LENGTH)
}

use dep::ethereum::misc::{types::{Address, Bytes32, ADDRESS_LENGTH, BYTES32_LENGTH}, field::field_to_bytes32, bytes::add_bigint};
use dep::std::hash::keccak256;

global STORAGE_KEY_HASH_INPUT_LENGTH = 64;

pub(crate) fn mapping(slot: Bytes32, key: Bytes32) -> Bytes32 {
    let mut vector: BoundedVec<u8, STORAGE_KEY_HASH_INPUT_LENGTH> = BoundedVec::new();
    vector.extend_from_array(key);
    vector.extend_from_array(slot);
    keccak256(vector.storage(), STORAGE_KEY_HASH_INPUT_LENGTH)
}

pub(crate) fn dynamic_array(slot: Bytes32, size: Field, index: Field) -> Bytes32 {
    let start = keccak256(slot, 32);
    dynamic_array_with_precalculated_slot(start, size, index)
}

pub(crate) fn dynamic_array_with_precalculated_slot(slot: Bytes32, size: Field, index: Field) -> Bytes32 {
    add_bigint(slot, field_to_bytes32(size * index))
}

pub(crate) fn struct_slot(slot: Bytes32, offset: Field) -> Bytes32 {
    add_bigint(slot, field_to_bytes32(offset))
}

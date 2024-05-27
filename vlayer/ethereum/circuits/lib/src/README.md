# Slots

This is a [Noir](https://noir-lang.org) library for slots.

The library consists of functions:

- ```rust
  pub(crate) fn mapping(slot: Bytes32, key: Bytes32) -> Bytes32;
  ```

  Calculates slot number of value corresponding to a mapping `key`. `Slot` argument is the storage location of the mapping calculated after applying storage layout rules.

- ```rust
  pub(crate) fn dynamic_array(slot: Bytes32, size: Field, index: Field) -> Bytes32;
  ```

  Calculates slot number where element at `index` in dynamic array is located. `Slot` argument is the storage location of the dynamic array calculated after applying storage layout rules. `Size` defines the size of elements in the array.

- There is an analogical function where `slot` argument is a precalculated slot of the first element in the array:

  ```rust
  pub(crate) fn dynamic_array_with_precalculated_slot(slot: Bytes32, size: Field, index: Field) -> Bytes32;
  ```

- ```rust
  pub(crate) fn struct_slot(slot: Bytes32, offset: Field) -> Bytes32;
  ```

  Calculates the slot of element at `offset` in the structure that begins at `slot`.

### Example

```rust
token_id_to_slot: |token_id| {
    let TOKEN_OWNERS_INNER_ENTRIES_SLOT = field_to_bytes32(10);

    mapping(TOKEN_OWNERS_INNER_ENTRIES_SLOT, token_id)
}

token_id_to_slot: |token_id| {
    let TOKEN_OWNERS_INNER_ENTRIES_SLOT = [...];

    let owner_slot = dynamic_array_with_precalculated_slot(TOKEN_OWNERS_INNER_ENTRIES_SLOT, 2, bytes32_to_field(token_id));

    struct_slot(owner_slot, 1)
}
```

Examples of usage of this library can be seen in [nft_list.nr](./nft_list.nr) file

# Solidity storage slots

This is a [Noir](https://noir-lang.org) library for calculating slot positions in contract storage.

The library consists of functions:

- ```rust
  pub(crate) fn mapping(slot: Bytes32, key: Bytes32) -> Bytes32;
  ```

  Calculates the slot of a value corresponding to a mapping `key`. `Slot` argument is the storage location of the mapping calculated after applying storage layout rules.

- ```rust
  pub(crate) fn dynamic_array(slot: Bytes32, size: Field, index: Field) -> Bytes32;
  ```

  Calculates the slot where element at `index` in dynamic array is located. `Slot` argument is the storage location of the dynamic array calculated after applying storage layout rules. `Size` defines the size of elements in the array.

- There is an analogical function where `slot` argument is a precalculated slot of the first element in the array:

  ```rust
  pub(crate) fn dynamic_array_with_precalculated_slot(slot: Bytes32, size: Field, index: Field) -> Bytes32;
  ```

- ```rust
  pub(crate) fn struct_slot(slot: Bytes32, offset: Field) -> Bytes32;
  ```

  Calculates the slot of an element at `offset` in the structure that begins at `slot`.

### Examples

The examples below show how slots of particular data can be found using this library. In this case searched data will be the owner of a token of `token_id`.
There are two types of tokens used in these examples.

#### [Crypto Punk token](https://etherscan.io/address/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb)

In case of Crypto Punk tokens, owners of tokens are stored in a map that is stored at 10th slot. It can be found there: https://etherscan.io/address/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb#code.

```rust
    mapping(field_to_bytes32(10), token_id)
```

#### [Bored ape yacht club token example](https://etherscan.io/token/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)

In case of Bored Ape Yacht Club tokens, list of owners is stored in a dynamic array of structures of two elements simulating a map. The starting position of this list is 2 as can be checked here: https://evm.storage/eth/19967215/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d#table. Because of that one can use either `dynamic_array` function with `slot` argument set to 2, or `dynamic_array_with_precalculated_slot` with precalculated slot of this array. After finding position of a structure, `struct_slot` function finds the searched information in this structure. Owner is stored at the second position in this structure, so `offset` argument is set to 1.

```rust
let BORED_APE_YACHT_CLUB_TOKEN_OWNERS_INNER_ENTRIES_SLOT = keccak256(2, 32);

let owner_slot = dynamic_array_with_precalculated_slot(BORED_APE_YACHT_CLUB_TOKEN_OWNERS_INNER_ENTRIES_SLOT, 2, bytes32_to_field(token_id));

struct_slot(owner_slot, 1)
```

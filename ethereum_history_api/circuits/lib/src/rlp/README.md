# RLP decoding

This is a [Noir](https://noir-lang.org) library to decode [RLP](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/)

RLP encoding works with two types of items. A string & a list. Therefore this lib contains two main functions:

- ```rust
  pub fn decode_string<N>(data: Fragment) -> RlpFragment;
  ```
- ```rust
  pub fn decode_list<N, NUM_FIELDS>(data: Fragment) -> RlpList<NUM_FIELDS>;
  ```
- There is also a more performant special case version of `decode_list`, that can be used when we know that our input consists exclusively of strings of length <= 55 bytes.
  ```rust
  pub fn decode_list_of_small_strings<N, NUM_FIELDS>(data: Fragment) -> RlpList<NUM_FIELDS>;
  ```

## Example

```rust
let rlp = [0x82, 0x10, 0x00]; // "0x1000"
decode_string(rlp.into());
// {offset: 1, length: 2, data_type: STRING}

let rlp = [0xc2, 0x80, 0x10]; // ["", "0x10"]
let decoded = decode_list(rlp.into());
// [{offset: 2, length: 0, data_type: STRING}, {offset: 2, length: 1, data_type: STRING}]

// Or using our helper assert methods:
decoded.get(0).assert_eq_empty_string("Field 0");
decoded.get(1).assert_eq_u64("Field 1", rlp, 0x10);
```

## What is Fragment

[Fragment](../misc/README.md) is a dynamically-sized view into a comptime-sized sequence of elements.  
In the example above, Into trait converts array into Fragment.

# RLP types

## RlpFragment

```Rust
struct RlpFragment {
    offset: u64,
    length: u64,
    data_type: u64 // STRING or LIST
}
```

It exists only in connection with the particular array of RLP encoding as it doesn't provide data itself. Ideally we would want to use only `Fragment` which includes data. Current Noir state makes using data, in each case when we use RlpFragment, much too inefficient so we use RlpFragment for performance reasons.

There are several comparison methods in RlpFragment implementation. They check if in given RLP encoding array, at position set by this fragment, there is given data. Each of these function is made to receive data as different type to simplify its usage:

- `assert_eq_bytes`
- `assert_eq_bounded_vec`
- `assert_empty_string`
- `assert_eq_u1`
- `assert_eq_u8`
- `assert_eq_u32`
- `assert_eq_u64`
- `assert_eq_u128`
- `assert_eq_address`
- `assert_eq_bytes32`

## RlpList

```Rust
type RlpList<MAX_FIELDS> = BoundedVec<RlpFragment, MAX_FIELDS>;
```

# Interface

These functions receive RLP encoding as `Fragment` type and return information about offset, length and data type of data encoded.  
**Important:** Returned offset doesn't include Fragment's offset.  
Data should contain whole element with its RLP header.

## decode_string

```Rust
pub fn decode_string<N>(data: Fragment) -> RlpFragment;
```

decodes RLP of singular string. It can be a single byte, short (<=55 bytes) or long (> 55 bytes) string.

## decode_list

```Rust
pub fn decode_list<N, NUM_FIELDS>(data: Fragment) -> RlpList<NUM_FIELDS>;
```

decodes a list. It returns an [`RlpList`](#rlplist), in which each [`RlpFragment`](#rlpfragment) includes information about consequent items.

**Important:** Returned offset and length omits the header for strings, but for lists header is included.

## decode_list_of_small_strings

```Rust
pub fn decode_list_of_small_strings<N, NUM_FIELDS>(data: Fragment) -> RlpList<NUM_FIELDS>;
```

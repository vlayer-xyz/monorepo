# RLP decoding

This is a [Noir](https://noir-lang.org) library to decode [RLP](#rlp-encoding).

We introduce two main decoding [functions](#functions):

- ```rust
  pub fn decode_string<N>(data: Fragment) -> (u64, u64);
  ```
- ```rust
  pub fn decode_list<N, NUM_FIELDS>(data: Fragment) -> RlpList<NUM_FIELDS>;
  ```

### Use case

This is an example of usage for this library. This is a part of decoding header of block.  
In this example we use `decode_list` function and two methods on [RlpFragment](#rlpfragment): `assert_eq_u64`, `assert_eq_bytes32`

```rust
let header_rlp_list: RlpList<MAX_HEADER_FIELDS_COUNT> = decode_list(encoded_data);

header_rlp_list.get(BLOCK_NUM_INDEX).assert_eq_u64(
    "Block number",
    block_header_rlp.data,
    block_header_partial.number
);
header_rlp_list.get(STATE_ROOT_INDEX).assert_eq_bytes32(
    "State root",
    block_header_rlp.data,
    block_header_partial.state_root
);
```

# Functions

There are three public decoding functions:

- [decode_string](#decode_string)
- [decode_list](#decode_list)
- [decode_list_of_small_strings](#decode_list_of_small_strings)

They receive RLP encoding as `Fragment` type and return information about offset, length and data type of data encoded.  
**Important:** Returned offset doesn't include Fragment's offset.  
Data should contain whole element with its RLP header.

All decoding functions are implemented in `decode.nr` file.

## decode_string

```Rust
pub fn decode_string<N>(data: Fragment) -> (u64, u64);
```

decode_string function decodes RLP of singular string. It can be a single byte, short (<=55 bytes) or long (> 55 bytes) string.  
Function returns a pair of offset and length of string in given Fragment.

## decode_list

```Rust
pub fn decode_list<N, NUM_FIELDS>(data: Fragment) -> RlpList<NUM_FIELDS>;
```

decode_list decodes a list. It returns an [`RlpList`](#rlplist), in which each [`RlpFragment`](#rlpfragment) includes information about consequent items.

**Important:** Returned offset and length omits the header for strings, but for lists header is included.

## decode_list_of_small_strings

```Rust
pub fn decode_list_of_small_strings<N, NUM_FIELDS>(data: Fragment) -> RlpList<NUM_FIELDS>;
```

This function is an optimization of decode_list function used when array includes only strings shorter than 55 bytes (single bytes included).

## Private functions

### decode_to_rlp_header

```Rust
pub fn decode_to_rlp_header<N>(data: Fragment) -> RlpHeader;
```

Recognizes type of encoded data based on its encoded header. It reads bytes that create a header and based on them, calculates the length, the offset and the data type of following data. It returns this information in form of [`RlpHeader`](#rlpheader).

### get_small_string_offset_and_length

```Rust
pub fn get_small_string_offset_and_length(first_byte: u8) -> (u64, u64);
```

Function with main purpose similar to decode_to_rlp_header, but made only for short strings and singular bytes.  
Because of that, it receives only one byte of header.  
Returns only offset and length of the string as a pair.

### extract_payload_len

```Rust
pub fn extract_payload_len<N>(data: Fragment, lenlen: u64) -> u64;
```

extract_payload_len decodes length of data longer than 55 bytes (long string, long list).  
It receives two argument: data, and length in bytes of encoded length of data ([lenlen](#distinguishable-types-of-data)). Based on them length of data is calculated.  
This function is used by decode_to_rlp_header function.

# RLP types

We created three types used to work with RLP encodings:

- [RlpFragment](#rlpfragment)
- [RlpList](#rlplist)
- [RlpHeader](#rlpheader)

They are all implemented in file `types.nr`.

## RlpFragment

```Rust
struct RlpFragment {
    offset: u64,
    length: u64,
    data_type: u64 // STRING or LIST
}
```

RlpFragment is an information about position and type of element in an RLP encoding.

It exists only in connection with the particular array of RLP encoding as it doesn't provide data itself. Ideally we would want to use only our `Fragment` which includes data. Current Noir state makes using data, in each case when we use RlpFragment, much too inefficient and seriously slows down our program.

data_type is either STRING or LIST. There is an enum for these types: `STRING = 0` and `LIST = 1`.

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

Basically it's the decode information about multiple elements in a list. It gives RlpFragment of each following element.

## RlpHeader

```Rust
struct RlpHeader {
    offset: u64,
    length: u64,
    data_type: u64 // STRING or LIST
}
```

Gives information about a fragment of RLP **based strictly on its encoding**. Used as a result in `decode_to_rlp_header` function. As opposed to [RlpFragment](#rlpfragment) it doesn't take yet into account for example position of element in a list.

# RLP encoding

Ethereum documentation about RLP encoding: https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/

### Distinguishable types of data

There are five different cases of encoding for data. Each of them is differentiated based on its header in RLP encoding.  
[decode_to_rlp_header](#decode_to_rlp_header) function is responsible for recognizing them.

- single byte
  - single byte of value < 128
  - no header
  - type: STRING
- short string
  - string of < 56 bytes
  - header consists of one byte of value `0x80 + length of string`
  - type: STRING
- long string
  - string of >= 56 bytes
  - header consists of one byte of value `0xb7 + lenlen`\* and then `lenlen` bytes encoding length of string
  - type: STRING
- short list
  - list with < 56 bytes
  - header consists of one byte of value `0xc0 + length of list`
  - type: LIST
- long list
  - list with >= 56 bytes
  - header consists of one byte of value `0xf7 + lenlen` and then `lenlen` bytes encoding length of list
  - type: LIST

\* `lenlen` in used by us to name length in bytes of length of string or list (length of length).  
 **Important:** we have a constraint that there might be maximum 2 bytes representing length (i.e. lenlen <= 2).

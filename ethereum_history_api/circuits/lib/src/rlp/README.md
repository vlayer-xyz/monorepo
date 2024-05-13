# RLP encoding

Ethereum documentation about RLP encoding: https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/

### Disinguishable types of data

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

RlpFragment is an information about position and type of element in an RLP encoding. data_type is either STRING or LIST. There is an enum for these types: `STRING = 0` and `LIST = 1`.

It exists only in connection with the particular array of RLP encoding as it doesn't provide data itself. It doesn't include data because of optimization.

There are several comparison methods in RlpFragment implementation. They are asserts if in given RLP encoding array, at position set by this fragment, there is given data. Each of these function is made to receive data as different type to simplify its usage:

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

Basically it's the encode information about multiple elements in a list. It gives RlpFragment of each following element.

## RlpHeader

```Rust
struct RlpHeader {
    offset: u64,
    length: u64,
    data_type: u64 // STRING or LIST
}
```

Gives information about a fragment of RLP **based strictly on its encoding**. Used as a result in `decode_to_rlp_header` function. As opposed to [RlpFragment](#rlpfragment) it doesn't take yet into account for example position of element in a list.

# Functions

There are three main decoding functions:

- [decode_string](#decode_string)
- [decode_list](#decode_list)
- [decode_list_of_small_strings](#decode_list_of_small_strings)

They receive RLP encoding as `Fragment` type and return information about offset, length and data type of data encoded.  
**Important:** Returned offset doesn't include Fragment offset.  
Data in input should contain whole element with its RLP header.

All decoding functions are implemented in `decode.nr` file.

## decode_string

```Rust
pub fn decode_string<N>(input: [u8; N]) -> (u64, u64) {...}
```

decode_string function decodes RLP of singular string. It can be a single byte, short (<=55 bytes) or long (> 55 bytes) string.  
The result of the function is a pair of offset and length of string in given Fragment.

## decode_list

```Rust
pub fn decode_list<N, NUM_FIELDS>(input: [u8; N]) -> RlpList<NUM_FIELDS>{...}
```

decode_list decodes the whole list of items. It returns an [`RlpList`](#rlplist), in which each [`RlpFragment`](#rlpfragment) dictates the offset, length and data_type of consequent items.

**Important:** <ins>For strings</ins> returned offset and length <ins>omits the header</ins>, but <ins>for lists header is included</ins> within.

## decode_list_of_small_strings

```Rust
pub fn decode_list_of_small_strings<N, NUM_FIELDS>(input: [u8; N]) -> RlpList<NUM_FIELDS> {...}
```

This function is an optimization of decode_list function in case, when we know, that our array includes only strings shorter than 55 bytes (single bytes included).

## decode_to_rlp_header

```Rust
pub fn decode_to_rlp_header<N>(arr: [u8; N]) -> RlpHeader {...}
```

Function that recognizes the type of encoded data based on its encoded header. It means it reads bytes that create a header and based on them, calculates the length, the offset and the data type of following data. It returns this information in form of [`RlpHeader`](#rlpheader).

## get_small_string_offset_and_length

```Rust
pub fn get_small_string_offset_and_length(first_byte: u8) -> (u64, u64) {...}
```

Function with main purpose similar to decode_to_rlp_header, but made only for short strings and singular bytes.  
Because of that it receives only one byte of header.  
Returns only the offset and the length of string as a pair.

## extract_payload_len

```Rust
pub fn extract_payload_len<N>(arr: [u8; N], lenlen: u64) -> u64 {...}
```

extract_payload_len decodes length of data in case when they are longer than 55 bytes (long string, long list).  
It receives two argument: data, and length in bytes of encoded length of data (lenlen). Based on them length of data is calculated.  
This function is used by decode_to_rlp_header function.

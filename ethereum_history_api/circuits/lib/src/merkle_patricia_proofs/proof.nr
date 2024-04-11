use crate::rlp::decode::{decode_to_rlp_header, decode_list_of_small_strings, RlpList};
use crate::misc::{arrays::{sub_array_equals_up_to_length, memcpy_up_to_length}, types::Bytes32, bytes::bytes_to_nibbles};
use dep::std::hash::keccak256;

global MAX_NODE_LEN = 532;
global EVEN = 0;
global ODD = 1;

type Node = [u8; MAX_NODE_LEN];
type Leaf<MAX_LEAF_LEN> = [u8; MAX_LEAF_LEN];
type Key<MAX_KEY_LEN> = [u8; MAX_KEY_LEN];
type Value<MAX_VALUE_LEN> = [u8; MAX_VALUE_LEN];

struct Proof<MAX_DEPTH, MAX_LEAF_LEN> {
	nodes: [Node; MAX_DEPTH],
    // Leaf has a different max length than internal node as it contains the value of arbitrary length.
	leaf: Leaf<MAX_LEAF_LEN>, 
	depth: u64
}

pub fn leaf_get_len<MAX_LEN>(leaf: Leaf<MAX_LEN>) -> u32 {
    let rlp_leaf_header = decode_to_rlp_header(leaf);
    let leaf_unpadded_len = rlp_leaf_header.offset + rlp_leaf_header.length;
    assert(leaf_unpadded_len <= MAX_LEN, "Leaf RLP length exceeds MAX_LEN");
    leaf_unpadded_len as u32
}

// Prefixes mean:
// 0 - Extension node, even number of nibbles
// 1 - Extension node, odd number of nibbles
// 2 - Leaf node, even number of nibbles
// 3 - Leaf node, odd number of nibbles
pub fn parity(prefix: u8) -> u8 {
    assert(prefix < 4, "Prefix must be 0, 1, 2 or 3");
    prefix % 2
}

// Leaf and extension nodes are RLP lists with 2 elements: prefixed key nibbles (in bytes) and value.
// This function removes the prefix and returns appropriate number of key nibbles according to the parity of the prefix (see function: parity).
pub fn strip_prefix<MAX_KEY_LEN, MAX_KEY_NIBBLE_LEN>(
    prefixed_key_bytes: [u8; MAX_KEY_LEN],
    prefixed_len: u64
) -> ([u8; MAX_KEY_NIBBLE_LEN], u64) {
    assert(MAX_KEY_LEN * 2 == MAX_KEY_NIBBLE_LEN, "Generic arguments don't match");
    let prefixed_key_nibbles: [u8; MAX_KEY_NIBBLE_LEN] = bytes_to_nibbles(prefixed_key_bytes);

    let mut stripped_nibbles = [0; MAX_KEY_NIBBLE_LEN];
    let parity = parity(prefixed_key_nibbles[0]);
    if (parity == EVEN) {
        assert(prefixed_key_nibbles[1] == 0, "Expected a zero after a prefix of even parity");
    }
    let offset = 2 - parity as u64;
    let stripped_len = prefixed_len * 2 - offset;
    memcpy_up_to_length(
        &mut stripped_nibbles,
        prefixed_key_nibbles,
        offset,
        stripped_len
    );

    (stripped_nibbles, stripped_len)
}

pub fn assert_merkle_proof<MAX_KEY_LEN, MAX_VALUE_LEN, MAX_DEPTH, MAX_LEAF_LEN>(
    key: Key<MAX_KEY_LEN>,
    value: Value<MAX_VALUE_LEN>,
    root: Bytes32,
    proof: Proof<MAX_DEPTH, MAX_LEAF_LEN>
) {
    let leaf_rlp_list: RlpList<2> = decode_list_of_small_strings(proof.leaf);
    assert(leaf_rlp_list.num_fields == 2, "Leaf expected to have 2 fields");

    let leaf_parity_prefix_len = 1; // TODO: Remove this hack
    assert(
        sub_array_equals_up_to_length(
            key,
            proof.leaf,
            leaf_rlp_list.fragments[0].offset + leaf_parity_prefix_len,
            leaf_rlp_list.fragments[0].length - leaf_parity_prefix_len
        ), "Key mismatch"
    );

    assert(
        sub_array_equals_up_to_length(
            value,
            proof.leaf,
            leaf_rlp_list.fragments[1].offset,
            leaf_rlp_list.fragments[1].length
        ), "Value mismatch"
    );

    assert(keccak256(proof.leaf, leaf_get_len(proof.leaf)) == root, "Invalid root");
}


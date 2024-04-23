use crate::rlp::decode::{decode_to_rlp_header, decode_list_of_small_strings, decode_list, RlpList};
use crate::misc::{
    fragment::Fragment, arrays::{sub_array_equals_up_to_length, memcpy_up_to_length},
    types::{Hash, HASH_LEN}, bytes::{bytes_to_nibbles, byte_to_nibbles, right_pad}
};
use dep::std::hash::keccak256;

global MAX_NODE_LEN = 532;
global MAX_NODE_FIELDS = 17;
global BRANCH_NODE_NUM_FIELDS = 17;
global EXTENSION_NODE_NUM_FIELDS = 2;
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

struct ProofInput<MAX_KEY_LEN, MAX_VALUE_LEN, MAX_DEPTH, MAX_LEAF_LEN> {
    key: Key<MAX_KEY_LEN>,
    value: Value<MAX_VALUE_LEN>,
    proof: Proof<MAX_DEPTH, MAX_LEAF_LEN>
}

pub fn get_node_len<MAX_LEN>(node: [u8; MAX_LEN]) -> u64 {
    let node_rlp_header = decode_to_rlp_header(node);
    let node_unpadded_len = node_rlp_header.offset + node_rlp_header.length;
    assert(node_unpadded_len <= MAX_LEN, "Node RLP length exceeds MAX_LEN");

    node_unpadded_len
}

// Prefixes mean:
// 0 - Extension node, even number of nibbles
// 1 - Extension node, odd number of nibbles
// 2 - Leaf node, even number of nibbles
// 3 - Leaf node, odd number of nibbles
pub fn parity(prefix: u8) -> u64 {
    assert(prefix < 4, "Prefix must be 0, 1, 2 or 3");
    (prefix % 2) as u64
}

// Leaf and extension nodes are RLP lists with 2 elements: prefixed key nibbles (in bytes) and value.
// This function removes the prefix and returns appropriate number of key nibbles according to the parity of the prefix (see function: parity).
pub fn strip_prefix<MAX_PREFIXED_KEY_NIBBLE_LEN>(prefixed_key_bytes: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN>) -> Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN> {
    let mut prefixed_key_nibbles = bytes_to_nibbles(prefixed_key_bytes);

    let prefix = prefixed_key_nibbles.pop_front();
    let parity = parity(prefix);
    if (parity == EVEN) {
        assert(prefixed_key_nibbles.pop_front() == 0, "Expected a zero after a prefix of even parity");
    }

    prefixed_key_nibbles
}

pub fn extract_hash_from_branch_node<MAX_PREFIXED_KEY_NIBBLE_LEN>(
    node: Node,
    node_rlp_list: RlpList<MAX_NODE_FIELDS>,
    key_nibbles: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN>,
    key_ptr: &mut u64
) -> Fragment<HASH_LEN> {
    let curr_nibble = key_nibbles.at(*key_ptr);
    assert(
        node_rlp_list.fragments[curr_nibble].length == HASH_LEN, "Expected a hash at position given by the key nibble"
    );
    *key_ptr += 1;

    Fragment::new(node_rlp_list.fragments[curr_nibble].offset, HASH_LEN, node).focus()
}

pub fn extract_hash_from_extension_node<MAX_PREFIXED_KEY_NIBBLE_LEN>(
    node: Node,
    node_rlp_list: RlpList<MAX_NODE_FIELDS>,
    key_nibbles: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN>,
    key_ptr: &mut u64
) -> Fragment<HASH_LEN> {
    let prefixed_extension_key_part: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN> = Fragment::new(
        node_rlp_list.fragments[0].offset,
        node_rlp_list.fragments[0].length,
        node
    ).focus();

    let (prefix, _) = byte_to_nibbles(prefixed_extension_key_part.at(0));
    assert((prefix == 0) | (prefix == 1), "Extension parity prefix must be 0 or 1");
    let extension_key_part = strip_prefix(prefixed_extension_key_part); // Extension nodes have a prefix that needs to be removed.
    let curr_key_nibbles_part = key_nibbles.subfragment(*key_ptr, extension_key_part.length);
    assert(
        extension_key_part == curr_key_nibbles_part, "Extension key part does not correspond to given key nibbles"
    );
    assert(
        node_rlp_list.fragments[1].length == HASH_LEN, "Expected a hash at the end of the extension node"
    );
    *key_ptr += extension_key_part.length;

    Fragment::new(node_rlp_list.fragments[1].offset, HASH_LEN, node).focus()
}

pub fn extract_hash<MAX_PREFIXED_KEY_NIBBLE_LEN>(
    node: Node,
    key_nibbles: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN>,
    key_ptr: &mut u64
) -> Fragment<HASH_LEN> {
    let mut hash = Fragment::new_focused([0; HASH_LEN]);
    let node_rlp_list: RlpList<MAX_NODE_FIELDS> = decode_list_of_small_strings(node);

    if (node_rlp_list.num_fields == BRANCH_NODE_NUM_FIELDS) {
        hash = extract_hash_from_branch_node(node, node_rlp_list, key_nibbles, key_ptr);
    } else if (node_rlp_list.num_fields == EXTENSION_NODE_NUM_FIELDS) {
        hash = extract_hash_from_extension_node(node, node_rlp_list, key_nibbles, key_ptr);
    } else {
        assert(false, "Invalid node type");
    }

    hash
}

pub fn verify_node_hash<MAX_LEN>(node: [u8; MAX_LEN], hash: [u8; HASH_LEN]) {
    println(keccak256(node, get_node_len(node) as u32));
    assert(keccak256(node, get_node_len(node) as u32) == hash, "Invalid node hash");
}

pub fn verify_leaf<MAX_LEAF_LEN, MAX_PREFIXED_KEY_NIBBLE_LEN, MAX_VALUE_LEN>(
    leaf: Leaf<MAX_LEAF_LEN>,
    key_nibbles: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN>,
    key_ptr: &mut u64,
    value: Value<MAX_VALUE_LEN>
) {
    let leaf_rlp_list: RlpList<2> = decode_list(leaf);
    assert(leaf_rlp_list.num_fields == 2, "Leaf expected to have 2 fields");

    let prefixed_leaf_key_part: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN> = Fragment::new(
        leaf_rlp_list.fragments[0].offset,
        leaf_rlp_list.fragments[0].length,
        leaf
    ).focus();

    let (prefix, _) = byte_to_nibbles(prefixed_leaf_key_part.at(0));
    assert((prefix == 2) | (prefix == 3), "Leaf parity prefix must be 2 or 3");
    let leaf_key_part = strip_prefix(prefixed_leaf_key_part);
    let left_key_ending = key_nibbles.subfragment(*key_ptr, leaf_key_part.length);
    assert(leaf_key_part == left_key_ending, "Leaf key part does not correspond to left key nibbles");
    *key_ptr += leaf_key_part.length;
    assert(*key_ptr == key_nibbles.length, "Expected to consume all key nibbles");

    let value = right_pad(value);
    let value_rlp_fragment = leaf_rlp_list.fragments[1];
    // Verify that extracted value matches the expected value.
    assert(value_rlp_fragment.length == value.len, "Value length mismatch");
    assert(
        sub_array_equals_up_to_length(
            value.storage,
            leaf,
            value_rlp_fragment.offset,
            value_rlp_fragment.length
        ), "Value mismatch"
    );
}

pub fn verify_merkle_proof<MAX_PREFIXED_KEY_NIBBLE_LEN, MAX_VALUE_LEN, MAX_DEPTH, MAX_LEAF_LEN>(
    _key: Key<MAX_PREFIXED_KEY_NIBBLE_LEN>,
    _value: Value<MAX_VALUE_LEN>,
    _root: Hash,
    _proof: Proof<MAX_DEPTH, MAX_LEAF_LEN>
) {
    assert(false, "Not implemented");
}


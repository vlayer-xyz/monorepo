use crate::rlp::decode::{decode_to_rlp_header, decode_list_of_small_strings};
use crate::rlp::list::RlpList;
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
pub fn parity(prefix: u8) -> u64 {
    assert(prefix < 4, "Prefix must be 0, 1, 2 or 3");
    (prefix % 2) as u64
}

// Leaf and extension nodes are RLP lists with 2 elements: prefixed key nibbles (in bytes) and value.
// This function removes the prefix and returns appropriate number of key nibbles according to the parity of the prefix (see function: parity).
pub fn strip_prefix<MAX_PREFIXED_KEY_NIBBLE_LEN>(prefixed_key_bytes: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN>) -> Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN> {
    let mut prefixed_key_nibbles = bytes_to_nibbles(prefixed_key_bytes);

    let parity = parity(prefixed_key_nibbles.pop_front());
    if (parity == EVEN) {
        assert(prefixed_key_nibbles.pop_front() == 0, "Expected a zero after a prefix of even parity");
    }

    prefixed_key_nibbles
}

pub fn extract_hash_from_branch_node<MAX_PREFIXED_KEY_NIBBLE_LEN>(
    node: Node,
    node_rlp_list: RlpList<MAX_NODE_LEN, MAX_NODE_FIELDS>,
    key_nibbles: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN>,
    key_ptr: &mut u64
) -> Fragment<HASH_LEN> {
    let curr_nibble = key_nibbles.at(*key_ptr);
    assert(
        node_rlp_list.get(curr_nibble as u64).fragment.length == HASH_LEN, "Expected a hash at position given by the key nibble"
    );
    *key_ptr += 1;

    Fragment::new(
        node_rlp_list.get(curr_nibble as u64).fragment.offset,
        HASH_LEN,
        node
    ).focus()
}

pub fn extract_hash_from_extension_node<MAX_PREFIXED_KEY_NIBBLE_LEN>(
    node: Node,
    node_rlp_list: RlpList<MAX_NODE_LEN, MAX_NODE_FIELDS>,
    key_nibbles: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN>,
    key_ptr: &mut u64
) -> Fragment<HASH_LEN> {
    let prefixed_extension_key_part: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN> = Fragment::new(
        node_rlp_list.get(0).fragment.offset,
        node_rlp_list.get(0).fragment.length,
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
        node_rlp_list.get(1).fragment.length == HASH_LEN, "Expected a hash at the end of the extension node"
    );
    *key_ptr += extension_key_part.length;

    Fragment::new(node_rlp_list.get(1).fragment.offset, HASH_LEN, node).focus()
}

pub fn extract_hash<MAX_PREFIXED_KEY_NIBBLE_LEN>(
    node: Node,
    key_nibbles: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN>,
    key_ptr: &mut u64
) -> Fragment<HASH_LEN> {
    let mut hash = Fragment::new_focused([0; HASH_LEN]);
    let node_rlp_list: RlpList<MAX_NODE_LEN, MAX_NODE_FIELDS> = decode_list_of_small_strings(node);

    if (node_rlp_list.len() == BRANCH_NODE_NUM_FIELDS) {
        hash = extract_hash_from_branch_node(node, node_rlp_list, key_nibbles, key_ptr);
    } else if (node_rlp_list.len() == EXTENSION_NODE_NUM_FIELDS) {
        hash = extract_hash_from_extension_node(node, node_rlp_list, key_nibbles, key_ptr);
    } else {
        assert(false, "Invalid node type");
    }

    hash
}

pub fn assert_merkle_proof<MAX_PREFIXED_KEY_NIBBLE_LEN, MAX_VALUE_LEN, MAX_DEPTH, MAX_LEAF_LEN>(
    key: Key<MAX_PREFIXED_KEY_NIBBLE_LEN>,
    value: Value<MAX_VALUE_LEN>,
    root: Hash,
    proof: Proof<MAX_DEPTH, MAX_LEAF_LEN>
) {
    let key = right_pad(key);
    let key_nibbles = bytes_to_nibbles(Fragment::new_with_length(key.len, key.storage));

    let leaf_rlp_list: RlpList<MAX_LEAF_LEN, 2> = decode_list_of_small_strings(proof.leaf);
    assert(leaf_rlp_list.len() == 2, "Leaf expected to have 2 fields");

    let prefixed_leaf_key_part: Fragment<MAX_PREFIXED_KEY_NIBBLE_LEN> = Fragment::new(
        leaf_rlp_list.get(0).fragment.offset,
        leaf_rlp_list.get(0).fragment.length,
        proof.leaf
    ).focus();

    let (prefix, _) = byte_to_nibbles(prefixed_leaf_key_part.at(0));
    assert((prefix == 2) | (prefix == 3), "Leaf parity prefix must be 2 or 3");
    let leaf_key_part = strip_prefix(prefixed_leaf_key_part);
    assert(leaf_key_part == key_nibbles, "Key mismatch");

    assert(
        sub_array_equals_up_to_length(
            value,
            proof.leaf,
            leaf_rlp_list.get(1).fragment.offset,
            leaf_rlp_list.get(1).fragment.length
        ), "Value mismatch"
    );

    assert(keccak256(proof.leaf, leaf_get_len(proof.leaf)) == root, "Invalid root");
}


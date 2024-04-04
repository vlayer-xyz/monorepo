use crate::misc::{arrays::sub_array_equals_up_to_length, types::Bytes32};
use dep::std::hash::keccak256;
use dep::proof::rlp::{decode1_small_lis, decode_len, RLP_List};

global MAX_NODE_LEN = 1; // 532;

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
    let rlp_leaf_header = decode_len(leaf);
    let leaf_unpadded_len = rlp_leaf_header.offset + rlp_leaf_header.length;
    assert(leaf_unpadded_len <= MAX_LEN, "Leaf RLP length exceeds MAX_LEN");
    leaf_unpadded_len as u32
}

pub fn assert_merkle_proof<MAX_KEY_LEN, MAX_VALUE_LEN, MAX_DEPTH, MAX_LEAF_LEN>(
    _key: Key<MAX_KEY_LEN>,
    value: Value<MAX_VALUE_LEN>,
    root: Bytes32,
    proof: Proof<MAX_DEPTH, MAX_LEAF_LEN>
) {
    let leaf_rlp_list: RLP_List<2> = decode1_small_lis(proof.leaf);
    assert(leaf_rlp_list.num_fields == 2, "Leaf expected to have 2 fields");

    assert(keccak256(proof.leaf, leaf_get_len(proof.leaf)) == root, "Invalid root");

    assert(
        sub_array_equals_up_to_length(
            value,
            proof.leaf,
            leaf_rlp_list.offset[1],
            leaf_rlp_list.length[1]
        ), "Value mismatch"
    );
}


use crate::misc::{arrays::sub_array_equals_up_to_length, types::Bytes32};
use dep::std::hash::keccak256;
use dep::proof::rlp::{decode1_small_lis, RLP_List};

global MAX_NODE_LEN = 1; // 532;

type Node = [u8; MAX_NODE_LEN];
type Leaf<MAX_LEAF_LEN> = [u8; MAX_LEAF_LEN];
type Key<MAX_KEY_LEN> = [u8; MAX_KEY_LEN];
type Value<MAX_VALUE_LEN> = [u8; MAX_VALUE_LEN];

/* TODO
* rlp encode leaf ✅
* remove constant
* assert key (rest) in leaf
* assert value in leaf ✅ 
* ensure proper length of leaf is asserted in keccak
* add value length
*/

struct Proof<MAX_DEPTH, MAX_LEAF_LEN> {
	nodes: [Node; MAX_DEPTH],
    // Leaf has a different max length than internal node as it contains the value of arbitrary length.
	leaf: Leaf<MAX_LEAF_LEN>, 
	depth: u64
}

pub fn assert_merkle_proof<MAX_KEY_LEN, MAX_VALUE_LEN, MAX_DEPTH, MAX_LEAF_LEN>(
    key: Key<MAX_KEY_LEN>,
    value: Value<MAX_VALUE_LEN>,
    root: Bytes32,
    proof: Proof<MAX_DEPTH, MAX_LEAF_LEN>
) {
    let rlp_list: RLP_List<2> = decode1_small_lis(proof.leaf);
    assert(rlp_list.num_fields == 2, "Leaf expected to have 2 fields");
    assert(keccak256(proof.leaf, MAX_LEAF_LEN) == root, "Invalid root");
    assert(sub_array_equals_up_to_length(value, proof.leaf, rlp_list.offset[1], rlp_list.length[1]), "Value mismatch");
}


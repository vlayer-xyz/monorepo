use crate::account::AccountWithinBlock;
use crate::account_with_storage::{StorageWithinBlock, Account};
use crate::receipt::{
    MAX_DEPTH_NO_LEAF as RECEIPT_MAX_DEPTH_NO_LEAF,
    MAX_PREFIXED_KEY_NIBBLE_LEN as RECEIPT_MAX_PREFIXED_KEY_NIBBLE_LEN,
    MAX_LEAF_LEN_M as RECEIPT_MAX_LEAF_LEN_M, MAX_VALUE_LEN_M as RECEIPT_MAX_VALUE_LEN_M
};
use crate::misc::{fragment::Fragment, types::{BYTES32_LENGTH, Bytes32, ADDRESS_LENGTH, Address}};
use crate::merkle_patricia_proofs::proof::{ProofInput, Proof, Node, MAX_NODE_LEN};
use dep::std::unsafe::zeroed;

trait Serde<LEN> {
    fn serialize(self) -> [Field; LEN];
    fn deserialize(data: [Field; LEN]) -> Self;
}

global U128_SERIALIZED_LEN = 2;

impl Serde<U128_SERIALIZED_LEN> for U128 {
    fn serialize(self) -> [Field; U128_SERIALIZED_LEN] {
        [self.lo, self.hi]
    }

    fn deserialize(data: [Field; U128_SERIALIZED_LEN]) -> Self {
        U128 { lo: data[0], hi: data[1] }
    }
}

impl<LEN> Serde<LEN> for [u8; LEN] {
    fn serialize(self) -> [Field; LEN] {
        self.map(|x: u8| x as Field)
    }

    fn deserialize(data: [Field; LEN]) -> Self {
        data.map(|x: Field| x as u8)
    }
}

global ACCOUNT_LEN = 1 + 1 + BYTES32_LENGTH + BYTES32_LENGTH;

impl Serde<ACCOUNT_LEN> for Account {
    fn serialize(self) -> [Field; ACCOUNT_LEN] {
        let mut data: BoundedVec<Field, ACCOUNT_LEN> = BoundedVec::new();
        data.push(self.nonce as Field);
        data.push(self.balance);
        data.extend_from_array(self.storage_root.serialize());
        data.extend_from_array(self.code_hash.serialize());
        data.storage
    }

    fn deserialize(data: [Field; ACCOUNT_LEN]) -> Self {
        let mut fragment = Fragment::from_array(data);
        let nonce = fragment.pop_front() as u64;
        let balance = fragment.pop_front();
        let storage_root = fragment.pop_front_array().deserialize();
        let code_hash = fragment.pop_front_array().deserialize();
        Account {
            nonce,
            balance,
            storage_root,
            code_hash,
        }
    }
}

global ACCOUNT_BLOCK_LEN = ACCOUNT_LEN + BYTES32_LENGTH;

impl Serde<ACCOUNT_BLOCK_LEN> for AccountWithinBlock {
    fn serialize(self) -> [Field; ACCOUNT_BLOCK_LEN] {
        let mut data: BoundedVec<Field, ACCOUNT_BLOCK_LEN> = BoundedVec::new();
        data.extend_from_array(self.account.serialize());
        data.extend_from_array(self.block_hash.serialize());
        data.storage
    }

    fn deserialize(data: [Field; ACCOUNT_BLOCK_LEN]) -> Self {
        let mut fragment = Fragment::from_array(data);
        let account = Account::deserialize(fragment.pop_front_array());
        let block_hash = fragment.pop_front_array().deserialize();
        AccountWithinBlock {
            account,
            block_hash,
        }
    }
}

global STORAGE_BLOCK_LEN = BYTES32_LENGTH + ACCOUNT_LEN + BYTES32_LENGTH;

impl Serde<STORAGE_BLOCK_LEN> for StorageWithinBlock<1> {
    fn serialize(self) -> [Field; STORAGE_BLOCK_LEN] {
        let mut data: BoundedVec<Field, STORAGE_BLOCK_LEN> = BoundedVec::new();
        data.extend_from_array(self.block_hash.serialize());
        data.extend_from_array(self.account.serialize());
        data.extend_from_array(self.values[0].serialize());
        data.storage
    }

    fn deserialize(data: [Field; STORAGE_BLOCK_LEN]) -> Self {
        let mut fragment = Fragment::from_array(data);
        let block_hash = fragment.pop_front_array().deserialize();
        let account = Account::deserialize(fragment.pop_front_array());
        let values = [fragment.pop_front_array().deserialize()];
        StorageWithinBlock {
            block_hash,
            account,
            values,
        }
    }
}

global RECEIPT_NODES_LEN = MAX_NODE_LEN * RECEIPT_MAX_DEPTH_NO_LEAF;

pub fn serialize_nodes(nodes: [Node; RECEIPT_MAX_DEPTH_NO_LEAF]) -> [Field; RECEIPT_NODES_LEN] {
    let mut data: BoundedVec<Field, RECEIPT_NODES_LEN> = BoundedVec::new();
    for i in 0..RECEIPT_MAX_DEPTH_NO_LEAF {
        data.extend_from_array(nodes[i].serialize());
    }
    data.storage
}

pub fn deserialize_nodes(data: [Field; RECEIPT_NODES_LEN]) -> [Node; RECEIPT_MAX_DEPTH_NO_LEAF] {
    let mut result: Fragment<RECEIPT_MAX_DEPTH_NO_LEAF, Node> = Fragment::empty();
    let mut fragment = Fragment::from_array(data);
    for _ in 0..RECEIPT_MAX_DEPTH_NO_LEAF {
        let node: Node = fragment.pop_front_array().deserialize();
        result.push_back(node);
    }
    result.data
}

global RECEIPT_PROOF_LEN_M = RECEIPT_MAX_DEPTH_NO_LEAF * MAX_NODE_LEN + RECEIPT_MAX_LEAF_LEN_M + 1;

impl Serde<RECEIPT_PROOF_LEN_M> for Proof<RECEIPT_MAX_DEPTH_NO_LEAF, RECEIPT_MAX_LEAF_LEN_M> {
    fn serialize(self) -> [Field; RECEIPT_PROOF_LEN_M] {
        let mut data: BoundedVec<Field, RECEIPT_PROOF_LEN_M> = BoundedVec::new();
        data.extend_from_array(serialize_nodes(self.nodes));
        data.extend_from_array(self.leaf.serialize());
        data.push(self.depth as Field);
        data.storage
    }

    fn deserialize(data: [Field; RECEIPT_PROOF_LEN_M]) -> Self {
        let mut fragment = Fragment::from_array(data);
        let nodes: [Node; RECEIPT_MAX_DEPTH_NO_LEAF] = deserialize_nodes(fragment.pop_front_array());
        let leaf = fragment.pop_front_array().deserialize();
        let depth = fragment.pop_front() as u64;
        Proof {
            nodes,
            leaf,
            depth,
        }
    }
}

global RECEIPT_PROOF_INPUT_LEN_M = RECEIPT_MAX_PREFIXED_KEY_NIBBLE_LEN + RECEIPT_MAX_VALUE_LEN_M + RECEIPT_PROOF_LEN_M;

impl Serde<RECEIPT_PROOF_INPUT_LEN_M> for ProofInput<RECEIPT_MAX_PREFIXED_KEY_NIBBLE_LEN, RECEIPT_MAX_VALUE_LEN_M, RECEIPT_MAX_DEPTH_NO_LEAF, RECEIPT_MAX_LEAF_LEN_M> {
    fn serialize(self) -> [Field; RECEIPT_PROOF_INPUT_LEN_M] {
        let mut data: BoundedVec<Field, RECEIPT_PROOF_INPUT_LEN_M> = BoundedVec::new();
        data.extend_from_array(self.key.serialize());
        data.extend_from_array(self.value.serialize());
        data.extend_from_array(self.proof.serialize());
        data.storage
    }

    fn deserialize(data: [Field; RECEIPT_PROOF_INPUT_LEN_M]) -> Self {
        let mut fragment = Fragment::from_array(data);
        let key = fragment.pop_front_array().deserialize();
        let value = fragment.pop_front_array().deserialize();
        let proof = Proof::deserialize(fragment.pop_front_array());
        ProofInput {
            key,
            value,
            proof
        }
    }
}

use crate::account::AccountWithinBlock;
use crate::account_with_storage::{StorageWithinBlock, Account};
use crate::misc::{fragment::Fragment, types::{BYTES32_LENGTH, Bytes32}};
use dep::std::unsafe::zeroed;

trait Serialize<LEN> {
    fn serialize(self) -> [Field; LEN];
}

global U128_SERIALIZED_LEN = 2;

impl Serialize<U128_SERIALIZED_LEN> for U128 {
    fn serialize(self) -> [Field; U128_SERIALIZED_LEN] {
        [self.lo, self.hi]
    }
}

impl Serialize<BYTES32_LENGTH> for Bytes32 {
    fn serialize(self) -> [Field; BYTES32_LENGTH] {
        let mut data: [Field; BYTES32_LENGTH] = zeroed();
        for i in 0..BYTES32_LENGTH {
            data[i] = self[i] as Field;
        }
        data
    }
}

global ACCOUNT_SERIALIZED_LEN = 1 + 1 + BYTES32_LENGTH + BYTES32_LENGTH;

impl Serialize<ACCOUNT_SERIALIZED_LEN> for Account {
    fn serialize(self) -> [Field; ACCOUNT_SERIALIZED_LEN] {
        let mut data: Fragment<ACCOUNT_SERIALIZED_LEN, Field> = Fragment::empty();
        data.push_back(self.nonce as Field);
        data.push_back(self.balance);
        data.extend_back(self.storage_root.serialize());
        data.extend_back(self.code_hash.serialize());
        data.to_array()
    }
}

global ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN = ACCOUNT_SERIALIZED_LEN + BYTES32_LENGTH;

impl Serialize<ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN> for AccountWithinBlock {
    fn serialize(self) -> [Field; ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN] {
        let mut data: Fragment<ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN, Field> = Fragment::empty();
        data.extend_back(self.account.serialize());
        data.extend_back(self.block_hash.serialize());
        data.to_array()
    }
}

global STORAGE_WITHIN_BLOCK_1_SERIALIZED_LEN = BYTES32_LENGTH + ACCOUNT_SERIALIZED_LEN + BYTES32_LENGTH;

impl Serialize<STORAGE_WITHIN_BLOCK_1_SERIALIZED_LEN> for StorageWithinBlock<1> {
    fn serialize(self) -> [Field; STORAGE_WITHIN_BLOCK_1_SERIALIZED_LEN] {
        let mut data: Fragment<STORAGE_WITHIN_BLOCK_1_SERIALIZED_LEN, Field> = Fragment::empty();
        data.extend_back(self.block_hash.serialize());
        data.extend_back(self.account.serialize());
        data.extend_back(self.values[0].serialize());
        data.to_array()
    }
}

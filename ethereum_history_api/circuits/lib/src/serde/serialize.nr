use crate::account::AccountWithinBlock;
use crate::account_with_storage::{StorageWithinBlock, Account};
use crate::misc::{fragment::Fragment, types::{BYTES32_LENGTH, Bytes32, ADDRESS_LENGTH, Address}};
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

impl Serde<BYTES32_LENGTH> for Bytes32 {
    fn serialize(self) -> [Field; BYTES32_LENGTH] {
        self.map(|x: u8| x as Field)
    }

    fn deserialize(data: [Field; BYTES32_LENGTH]) -> Self {
        data.map(|x: Field| x as u8)
    }
}

impl Serde<ADDRESS_LENGTH> for Address {
    fn serialize(self) -> [Field; ADDRESS_LENGTH] {
        self.map(|x: u8| x as Field)
    }

    fn deserialize(data: [Field; ADDRESS_LENGTH]) -> Self {
        data.map(|x: Field| x as u8)
    }
}

global ACCOUNT_SERIALIZED_LEN = 1 + 1 + BYTES32_LENGTH + BYTES32_LENGTH;

impl Serde<ACCOUNT_SERIALIZED_LEN> for Account {
    fn serialize(self) -> [Field; ACCOUNT_SERIALIZED_LEN] {
        let mut data: Fragment<ACCOUNT_SERIALIZED_LEN, Field> = Fragment::empty();
        data.push_back(self.nonce as Field);
        data.push_back(self.balance);
        data.extend_back(self.storage_root.serialize());
        data.extend_back(self.code_hash.serialize());
        data.to_array()
    }

    fn deserialize(data: [Field; ACCOUNT_SERIALIZED_LEN]) -> Self {
        let mut fragment = Fragment::new_focused(data);
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

global ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN = ACCOUNT_SERIALIZED_LEN + BYTES32_LENGTH;

impl Serde<ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN> for AccountWithinBlock {
    fn serialize(self) -> [Field; ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN] {
        let mut data: Fragment<ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN, Field> = Fragment::empty();
        data.extend_back(self.account.serialize());
        data.extend_back(self.block_hash.serialize());
        data.to_array()
    }

    fn deserialize(data: [Field; ACCOUNT_WITHIN_BLOCK_SERIALIZED_LEN]) -> Self {
        let mut fragment = Fragment::new_focused(data);
        let account: Account = Account::deserialize(fragment.pop_front_array());
        let block_hash = fragment.pop_front_array().deserialize();
        AccountWithinBlock {
            account,
            block_hash,
        }
    }
}

global STORAGE_WITHIN_BLOCK_1_SERIALIZED_LEN = BYTES32_LENGTH + ACCOUNT_SERIALIZED_LEN + BYTES32_LENGTH;

impl Serde<STORAGE_WITHIN_BLOCK_1_SERIALIZED_LEN> for StorageWithinBlock<1> {
    fn serialize(self) -> [Field; STORAGE_WITHIN_BLOCK_1_SERIALIZED_LEN] {
        let mut data: Fragment<STORAGE_WITHIN_BLOCK_1_SERIALIZED_LEN, Field> = Fragment::empty();
        data.extend_back(self.block_hash.serialize());
        data.extend_back(self.account.serialize());
        data.extend_back(self.values[0].serialize());
        data.to_array()
    }

    fn deserialize(data: [Field; STORAGE_WITHIN_BLOCK_1_SERIALIZED_LEN]) -> Self {
        let mut fragment = Fragment::new_focused(data);
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

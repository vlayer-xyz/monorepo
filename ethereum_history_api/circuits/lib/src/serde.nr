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
        let mut fragment: Fragment<ACCOUNT_LEN, Field> = From::from(data);
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
        let mut fragment: Fragment<ACCOUNT_BLOCK_LEN, Field> = From::from(data);
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
        let mut fragment: Fragment<STORAGE_BLOCK_LEN, Field> = From::from(data);
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

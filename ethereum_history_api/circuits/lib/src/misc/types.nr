use crate::serde::Serialize;
use dep::std::unsafe::zeroed;

global ADDRESS_LENGTH: u64 = 20;
type Address = [u8; ADDRESS_LENGTH];

global BYTES32_LENGTH: u64 = 32;
type Bytes32 = [u8; BYTES32_LENGTH];

impl Serialize<BYTES32_LENGTH> for Bytes32 {
    fn serialize(self) -> [Field; BYTES32_LENGTH] {
        let mut data: [Field; BYTES32_LENGTH] = zeroed();
        for i in 0..BYTES32_LENGTH {
            data[i] = self[i] as Field;
        }
        data
    }
}

global HASH_LEN = 32;
type Hash = Bytes32;

global U128_LENGTH: u64 = 16;

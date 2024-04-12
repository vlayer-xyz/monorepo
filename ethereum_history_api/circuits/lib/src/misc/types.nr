global ADDRESS_LENGTH: u64 = 20;
type Address = [u8; ADDRESS_LENGTH];

global BYTES32_LENGTH: u64 = 32;
type Bytes32 = [u8; BYTES32_LENGTH];

global U128_LENGTH: u64 = 16;

struct PaddedValue<MAX_LEN> {
    value: [u8; MAX_LEN],
    length: u64,
}

impl<MAX_LEN> PaddedValue<MAX_LEN> {
    pub fn new(value: [u8; MAX_LEN], length: u64) -> Self {
        for i in 0..MAX_LEN {
            if i >= length {
                assert(value[i] == 0, "PaddedValue: value is not zero-padded");
            }
        }
        Self { value, length }
    }
}

impl PaddedValue<0> {
    pub fn zero() -> Self {
        Self { value: [], length: 0 }
    }
}

impl<MAX_LEN> From<([u8; MAX_LEN], u64)> for PaddedValue<MAX_LEN> {
    fn from((value, length): ([u8; MAX_LEN], u64)) -> Self {
        Self { value, length }
    }
}

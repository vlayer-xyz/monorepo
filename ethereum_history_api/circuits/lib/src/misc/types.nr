type Address = [u8; 20];
type Bytes32 = [u8; 32];

struct PaddedValue<MAX_LEN> {
    value: [u8; MAX_LEN],
    length: u64,
}

impl<MAX_LEN> From<([u8; MAX_LEN], u64)> for PaddedValue<MAX_LEN> {
    fn from((value, length): ([u8; MAX_LEN], u64)) -> Self {
        Self { value, length }
    }
}

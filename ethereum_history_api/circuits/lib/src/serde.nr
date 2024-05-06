trait Serialize<LEN> {
    fn serialize(self) -> [Field; LEN];
}

global U128_SERIALIZED_LEN = 2;

impl Serialize<U128_SERIALIZED_LEN> for U128 {
    fn serialize(self) -> [Field; U128_SERIALIZED_LEN] {
        [self.lo, self.hi]
    }
}

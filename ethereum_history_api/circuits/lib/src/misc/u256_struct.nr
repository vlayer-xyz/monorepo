struct U256 {
    high: U128,
    low: U128,
}

impl U256 {
    fn new(high: U128, low: U128) -> Self {
        Self { high, low }
    }

    fn from_u64s(u64s: [u64; 4]) -> Self {
        Self { high: U128::from_u64s_le(u64s[0], u64s[1]), low: U128::from_u64s_le(u64s[2], u64s[3]) }
    }
}

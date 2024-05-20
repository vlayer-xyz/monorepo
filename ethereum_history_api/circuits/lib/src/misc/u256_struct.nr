struct U256 {
    high: U128,
    low: U128,
}

impl U256 {
    fn new(high: U128, low: U128) -> Self {
        Self { high, low }
    }
}

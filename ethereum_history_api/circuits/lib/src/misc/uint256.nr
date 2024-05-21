use dep::std::ops::Add;

global pow128 = 340282366920938463463374607431768211456; // 2^128

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

    fn zero() -> Self {
        Self { high: U128::from_integer(0), low: U128::from_integer(0) }
    }

    fn one() -> Self {
        Self { high: U128::from_integer(0), low: U128::from_integer(1) }
    }
}

impl Eq for U256 {
    fn eq(self, other: Self) -> bool {
        (self.high == other.high) & (self.low == other.low)
    }
}

impl Add for U256 {
    fn add(one: Self, other: Self) -> Self {
        let lo: Field = one.low.to_integer() + other.low.to_integer();

        let mut low = U128::from_integer(0);
        let mut carry = U128::from_integer(0);
        if(lo.lt(pow128)){
            low = U128::from_integer(lo);
        } else {
            low = U128::from_integer(lo - pow128);
            carry = U128::from_integer(1);
        }

        let hi: Field = one.high.to_integer() + other.high.to_integer() + carry.to_integer();
        assert(hi.lt(pow128), "attempt to add with overflow");

        let high = U128::from_integer(hi);

        Self { high, low }
    }
}

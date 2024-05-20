use crate::misc::u256_struct::U256;

global high = U128::from_integer(0x10000000000000000000000000000000);
global low = U128::from_integer(0x00000000000000000000000000000000);
global u64s = [0x1000000000000000, 0x0000000000000000, 0x0000000000000000, 0x0000000000000000];

#[test]
fn success() {
    let big_number = U256 { high, low };
    assert_eq(big_number.high, high);
    assert_eq(big_number.low, low);
}

#[test]
fn new() {
    let big_number = U256::new(high, low);
    assert_eq(big_number.high, high);
    assert_eq(big_number.low, low);
}

#[test]
fn from_u64s() {
    let big_number = U256::from_u64s(u64s);
    assert_eq(big_number.high, U128 { lo: u64s[0] as Field, hi: u64s[1] as Field });
    assert_eq(big_number.low, U128 { lo: u64s[2] as Field, hi: u64s[3] as Field });
}


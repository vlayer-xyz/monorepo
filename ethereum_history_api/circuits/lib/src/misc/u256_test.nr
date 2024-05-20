use crate::misc::u256_struct::U256;

global high = U128::from_integer(0x10000000000000000000000000000000);
global low = U128::from_integer(0x00000000000000000000000000000000);

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


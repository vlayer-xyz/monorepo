use crate::misc::uint256::U256;

global high = U128::from_integer(0x10000000000000000000000000000000);
global low = U128::zero();
global limit = U128::from_integer(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF);
global u64s = [0x1000000000000000, 0x0000000000000000, 0x0000000000000000, 0x0000000000000000];

global big_number = U256 { high, low };

#[test]
fn success() {
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

#[test]
fn zero_and_one() {
    let zero = U256::zero();
    assert_eq(zero.high, U128::zero());
    assert_eq(zero.low, U128::zero());

    let one = U256::one();
    assert_eq(one.high, U128::zero());
    assert_eq(one.low, U128::one());
}

#[test]
fn eq() {
    assert_eq(big_number, big_number);

    let big_number2 = U256::new(high, low);
    assert_eq(big_number, big_number2);
}

#[test]
fn not_eq() {
    let big_number2 = U256 { high, low: high };
    assert(big_number != big_number2);

    let big_number3 = U256 { high: low, low };
    assert(big_number != big_number3);
}

#[test]
fn sum() {
    let sum = big_number + big_number;

    assert_eq(sum, U256 { high: U128::from_integer(0x20000000000000000000000000000000), low });
}

#[test]
fn sum_with_carry() {
    let big_number = U256 { high, low: limit };
    let sum = big_number + U256::one();

    assert_eq(sum, U256 { high: U128::from_integer(0x10000000000000000000000000000001), low });
}

#[test(should_fail_with="attempt to add with overflow")]
fn sum_overflow() {
    let limit_number = U256 { high: limit, low: limit };
    let _ = limit_number + U256::one();
}

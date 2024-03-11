use crate::misc::u128_to_u8::{u128_to_u8};

#[test]
fn test_u128() {
    let high = 1;
    let low = 2;
    let result = u128_to_u8(U128::from_u64s_be(high, low));
    assert_eq(result, [
        0, 0, 0, 0, 0, 0, 0, 1,
        0, 0, 0, 0, 0, 0, 0, 2,
    ]);
}
